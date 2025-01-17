const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-FTB-ET-WEB-FT/events`;
const eventList = document.querySelector("#events");
const newEventForm = document.querySelector("#addEvent");

// === State ===
const state = {
  events: [],
};

// Fetch and render events
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
    renderEvents();
  } catch (err) {
    console.error(err);
  }
}

// Add a new event
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}

//delete event
async function deleteEvent(event) {
  try {
    const response = await fetch(`${API_URL}/${event.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Item deleted successfully");
    } else {
      console.error("Error deleting item");
    }
  } catch (err) {
    console.error(err);
  }
}

// Render events to the DOM
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = `<p>Sorry, there are no events</p>`;
    return;
  }

  const eventHTML = state.events.map((event) => {
    const container = document.createElement("li");
    const eventName = document.createElement("h2");
    eventName.innerText = event.name;

    const eventDescription = document.createElement("p");
    eventDescription.innerText = event.description;

    const eventDate = document.createElement("p");
    const formattedDate = event.date;
    eventDate.innerText = `Date and Time: ${formattedDate}`;

    const eventLocation = document.createElement("p");
    eventLocation.innerText = event.location;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.addEventListener("click", async (e) => {
      await deleteEvent(event);
      await getEvents();
      renderEvents();
    });

    container.replaceChildren(
      eventName,
      eventDescription,
      eventDate,
      eventLocation,
      deleteButton
    );
    return container;
  });

  eventList.replaceChildren(...eventHTML);
}

// Form submission handler
newEventForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = newEventForm.eventDate.value;
  const time = newEventForm.eventTime.value;
  const dateTimeISO = new Date(`${date}T${time}`).toISOString();

  const newEvent = {
    name: newEventForm.eventName.value,
    description: newEventForm.eventDescription.value,
    date: dateTimeISO,
    location: newEventForm.eventLocation.value,
  };

  const result = await addEvent(newEvent);
  console.log("Add event result:", result);
  e.target.reset();

  if (result.success) {
    await getEvents();
  }
});

getEvents();

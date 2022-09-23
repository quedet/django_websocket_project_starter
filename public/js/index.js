/**
 * VARIABLES
 */

// Connect to Websockets server (SocialNetworkConsumer)
const myWebsocket = new WebSocket(`${document.body.dataset.scheme === 'http' ? 'ws': 'wss'}://${document.body.dataset.host}/ws/social-network/`);
const inputAuthor = document.querySelector("#message-form__author")
const inputText = document.querySelector("#message-form__text")
const inputSubmit = document.querySelector("#message-form__submit")

/**
 * FUNCTIONS
 */

/**
 * Send data to Websockets server
 * @param {string} message
 * @param {WebSocket} webSocket
 * @return {void}
 */

function sendData(message, webSocket) {
    webSocket.send(JSON.stringify(message))
}

/**
 * Delete message
 * @param {Event} event
 * @return {void}
 */

function deleteMessage(event) {
    const message = {
        "action": "delete messages",
        "data": {
            "id": event.target.dataset.id
        }
    }

    sendData(message, myWebsocket)
}

/**
 * Displays the update form
 * @param {Event} event
 * @return {void}
 */
function displayUpdateForm(event) {
    const message = {
        "action": "open edit page",
        "data": {
            "id": event.target.dataset.id
        }
    }
    sendData(message, myWebsocket)
}

/**
 * Update message
 * @param {Event} event
 * @return {void}
 */

function updateMessage(event) {
    event.preventDefault()
    const message = {
        "action": "update message",
        "data": {
            "id": event.target.dataset.id,
            "author": event.target.querySelector("#message-form__author--update").value,
            "text": event.target.querySelector("#message-form__text--update").value
        }
    }
    sendData(message, myWebsocket)
}
/**
 * Send new message
 * @param {Event} event
 * @return {void}
 */

function sendNewMessage(event) {
    event.preventDefault()
    // Prepare teh information we will send
    const newdata = {
        "action": "add message",
        "data": {
            "author": inputAuthor.value,
            "text": inputText.value
        }
    }
    // Send the data to the server
    sendData(newdata, myWebsocket);

    // Clear message form
    inputText.value = ""
}

/**
 * Get the current page stored in #paginator as dataset
 * @returns {number}
 */

function getCurrentPage() {
    return parseInt(document.querySelector("#paginator").dataset.page)
}

/**
 * Switch to the next page
 * @param {Event} event
 * @return {void}
 */

function goToNextPage(event) {
    // Prepare the information we will send
    const newData = {
        "action": "list messages",
        "data": {
            "page": getCurrentPage() + 1
        }
    }
    // Send the data to trhe server
    sendData(newData, myWebsocket)
}

/**
 * Switch to the previous page
 * @param {Event} event
 * @return {void}
 */

function goToPreviousPage(event) {
    // Prepare the information we will send
    const newData = {
        "action": "list messages",
        "data": {
            "page": getCurrentPage() - 1
        }
    }
    // Send the data to the server
    sendData(newData, myWebsocket)
}

/**
 * EVENTS
 */

// Event when a new message is received by Websockets
myWebsocket.addEventListener("message", (event) => {
    // Parse the data received
    const data = JSON.parse(event.data);
    // Renders the HTML received from the consumer
    document.querySelector(data.selector).innerHTML = data.html;
    /* Reassigns the events of the newly rendered HTML */
    // Pagination
    document.querySelector("#messages__next-page")?.addEventListener("click", goToNextPage);
    document.querySelector("#messages__previous-page")?.addEventListener("click", goToPreviousPage);
    // Add to all delete buttons the event
    document.querySelectorAll(".messages__delete").forEach(button => {
        button.addEventListener("click", deleteMessage)
    })
    // Add to all update buttons the event
    document.querySelectorAll(".messages__update").forEach(button => {
        button.addEventListener("click", displayUpdateForm);
    });
    // Add to the update form the event
    document.querySelectorAll(".update-form").forEach(form => {
        form.addEventListener("submit", updateMessage);
    });
})

inputSubmit.addEventListener("click", sendNewMessage)
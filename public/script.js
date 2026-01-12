let conversationId = null;

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = role === 'user' ? 'You' : 'Assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = 'loading-message';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = 'Assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="loading"></div>';
    
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to UI
    addMessage(message, 'user');
    messageInput.value = '';
    sendButton.disabled = true;

    // Show loading indicator
    addLoadingMessage();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                conversationId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to get response');
        }

        // Update conversation ID
        conversationId = data.conversationId;

        // Remove loading and add assistant response
        removeLoadingMessage();
        addMessage(data.response, 'assistant');
    } catch (error) {
        removeLoadingMessage();
        addMessage(`Error: ${error.message}`, 'assistant');
        console.error('Error:', error);
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Focus input on load
messageInput.focus();

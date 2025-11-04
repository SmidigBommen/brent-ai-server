// Chat interface for LM Studio local API
let conversationHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearButton = document.getElementById('clearButton');
    const testConnection = document.getElementById('testConnection');
    const apiEndpoint = document.getElementById('apiEndpoint');
    const connectionStatus = document.getElementById('connectionStatus');

    // Test connection to LM Studio
    testConnection.addEventListener('click', async function() {
        const endpoint = apiEndpoint.value.trim();
        connectionStatus.textContent = 'Testing...';
        connectionStatus.className = '';
        
        try {
            // Try to get the base URL for a simple health check
            const baseUrl = endpoint.replace('/v1/chat/completions', '');
            const response = await fetch(`${baseUrl}/v1/models`, {
                method: 'GET',
            });
            
            if (response.ok) {
                const data = await response.json();
                connectionStatus.textContent = '✓ Connected';
                connectionStatus.className = 'connected';
                addMessage('system', `Connected! Found ${data.data ? data.data.length : 0} model(s).`);
            } else {
                throw new Error('Connection failed');
            }
        } catch (error) {
            connectionStatus.textContent = '✗ Failed';
            connectionStatus.className = 'disconnected';
            addMessage('error', 'Could not connect to LM Studio. Make sure the server is running.');
        }
    });

    // Send message
    sendButton.addEventListener('click', sendMessage);
    
    // Send on Enter (but allow Shift+Enter for new lines)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Clear chat
    clearButton.addEventListener('click', function() {
        conversationHistory = [];
        chatMessages.innerHTML = '<div class="message system-message"><strong>System:</strong> Chat cleared. Ready for a new conversation!</div>';
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        const endpoint = apiEndpoint.value.trim();
        if (!endpoint) {
            addMessage('error', 'Please enter an API endpoint.');
            return;
        }

        // Disable input while processing
        sendButton.disabled = true;
        userInput.disabled = true;

        // Add user message to chat
        addMessage('user', message);
        conversationHistory.push({
            role: 'user',
            content: message
        });

        // Clear input
        userInput.value = '';

        // Show loading indicator
        const loadingId = addMessage('assistant', 'Thinking...');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: conversationHistory,
                    temperature: 0.7,
                    max_tokens: 2000,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove loading message
            removeMessage(loadingId);

            // Get assistant response
            const assistantMessage = data.choices[0].message.content;
            
            // Add to conversation history
            conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            // Display assistant message
            addMessage('assistant', assistantMessage);

        } catch (error) {
            removeMessage(loadingId);
            addMessage('error', `Error: ${error.message}. Make sure LM Studio is running and the endpoint is correct.`);
            // Remove the last user message from history since it failed
            conversationHistory.pop();
        } finally {
            // Re-enable input
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }

    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        const messageId = Date.now();
        messageDiv.id = `msg-${messageId}`;
        messageDiv.className = `message ${type}-message`;
        
        const label = type === 'user' ? 'You' : 
                     type === 'assistant' ? 'Assistant' :
                     type === 'error' ? 'Error' : 'System';
        
        messageDiv.innerHTML = `<strong>${label}:</strong> ${escapeHtml(content)}`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageId;
    }

    function removeMessage(messageId) {
        const messageDiv = document.getElementById(`msg-${messageId}`);
        if (messageDiv) {
            messageDiv.remove();
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    console.log('💬 Chat interface loaded!');
    console.log('Make sure LM Studio is running with a model loaded.');
});

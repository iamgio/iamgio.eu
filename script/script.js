class ChatBubble extends HTMLElement {
    constructor() {
        super();

        // in/out
        const type = this.getAttribute('type');
        this.className = 'bubble bubble-' + type;

        const message = document.createElement('div');
        message.className = 'msg msg-' + type;

        const messageSpan = document.createElement('span');
        messageSpan.innerHTML = this.getAttribute('data-text');
        message.appendChild(messageSpan);

        const tail = document.createElement('div');
        tail.className = 'bubble-tail';

        if(this.hasAttribute('data-image')) {
            const image = document.createElement('img');
            image.setAttribute('src', this.getAttribute('data-image'));
            message.insertBefore(image, messageSpan);
        }

        if(type === 'out') {
            this.append(message, tail);
        } else {
            this.append(tail, message);
        }
    }
}

customElements.define('msg-bubble', ChatBubble);
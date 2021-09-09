class ChatBubble extends HTMLElement {
    constructor() {
        super();

        // in/out
        const type = this.getAttribute('type');
        this.className = 'bubble bubble-' + type;

        const message = document.createElement('div');
        message.className = 'msg msg-' + type;
        message.textContent = this.getAttribute('data-text');
        const tail = document.createElement('div');
        tail.className = 'bubble-tail';

        if(type === 'out') {
            this.append(message, tail);
        } else {
            this.append(tail, message);
        }
    }
}

customElements.define('msg-bubble', ChatBubble);
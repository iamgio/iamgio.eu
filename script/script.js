let messagesLength = 0;
let messageIndex = 0;

class ChatBubble extends HTMLElement {
    constructor() {
        super();

        // in/out
        const type = this.getAttribute('type');
        this.className = 'bubble bubble-' + type;
        this.style.display = 'none'

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

        messagesLength++;
    }
}

function animateBubble() {
    if(messageIndex < messagesLength) {
        const animate = 'animate__animated animate__fadeInUp'
        const bubble = document.getElementsByTagName('msg-bubble')[messageIndex];
        bubble.style.display = ''
        bubble.className += ' ' + animate;
        messageIndex++;
    }
}

customElements.define('msg-bubble', ChatBubble);

setInterval(() => {
    animateBubble()
}, 1800);
animateBubble()
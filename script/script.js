import("./external/smoothscroll.min.js").then((smoothscroll) => smoothscroll.polyfill());

let messagesLength = 0;

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

customElements.define('msg-bubble', ChatBubble);

const baseDelay = 1800;
function animateNext(messageIndex) {
    let delay = baseDelay;
    function animateBubble() {
        const animate = 'animate__animated animate__fadeInUp';
        const bubble = document.getElementsByTagName('msg-bubble')[messageIndex];
        bubble.style.display = '';
        bubble.scrollIntoView({behavior: 'smooth'});
        bubble.className += ' ' + animate;
        delay += bubble.getAttribute('data-text').length * 15;
    }
    animateBubble();
    setTimeout(() => {
        if(messageIndex < messagesLength) {
            animateNext(messageIndex + 1);
        }
    }, delay)
}
animateNext(0);
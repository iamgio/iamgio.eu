import("./external/smoothscroll.min.js").then((smoothscroll) => smoothscroll.polyfill());

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
    }
}

customElements.define('msg-bubble', ChatBubble);

let skipChatAnimation = false;
const baseDelay = 1500;
const chat = document.getElementById('chat');
const bubbles = document.getElementsByTagName('msg-bubble');
const scrollGradient = document.getElementById('chat-scroll-gradient');

function scrollToBottom(bubble) {
    const top = bubble ? chat.scrollTop + bubble.offsetHeight : chat.scrollHeight;
    chat.scrollTo({top: top, behavior: 'smooth'});
}

function animateNext(messageIndex) {
    let delay = skipChatAnimation ? 100 : baseDelay;
    function animateBubble() {
        const animate = 'animate__animated animate__fadeInUp';
        const bubble = bubbles[messageIndex];
        bubble.style.display = '';
        if(!skipChatAnimation) {
            delay += bubble.getAttribute('data-text').length * 15;
            scrollToBottom(bubble);
        }
        bubble.className += ' ' + animate;
    }
    animateBubble();
    setTimeout(() => {
        if(messageIndex < bubbles.length) {
            animateNext(messageIndex + 1);
        }
    }, delay)
}
animateNext(0);

chat.addEventListener('scroll', () => {
    scrollGradient.style.height = Math.min(30, chat.scrollTop) + 'px';
})
class ChatBubble extends HTMLElement {
    constructor() {
        super();

        // in/out
        const type = this.getAttribute('type');
        this.className = 'bubble bubble-' + type;
        this.style.display = 'none';

        const message = document.createElement('div');
        message.className = 'msg msg-' + type;

        const messageSpan = document.createElement('span');
        messageSpan.innerHTML = this.getAttribute('data-text');

        message.appendChild(messageSpan);

        const hasTail = this.getAttribute('tail') !== 'none';
        const tail = document.createElement('div');
        tail.className = 'bubble-tail';

        if(this.hasAttribute('data-image')) {
            const image = document.createElement('img');
            image.setAttribute('src', this.getAttribute('data-image'));
            message.insertBefore(image, messageSpan);
        }

        if(!hasTail) {
            this.append(message);
        } else if(type === 'out') {
            this.append(message, tail);
        } else {
            this.append(tail, message);
        }
    }
}

class OptionBubble extends HTMLElement {
    constructor() {
        super();

        const text = this.getAttribute('data-text');
        this.outerHTML = '<msg-bubble type="out" tail="none" data-text="' + text + '">';

        addEventListener('click', () => console.log('test'));
    }
}

customElements.define('msg-bubble', ChatBubble);
customElements.define('option-bubble', OptionBubble);

let skipChatAnimation = false;
let messageIndex = 0;
let timeoutId;
const baseDelay = 1500;
const chat = document.getElementById('chat');
const bubbles = chat.getElementsByTagName('msg-bubble');
const scrollGradient = document.getElementById('chat-scroll-gradient');

function scrollToBottom(bubble) {
    const top = bubble ? chat.scrollTop + bubble.offsetHeight : chat.scrollHeight;
    chat.scrollTo({top: top, behavior: 'smooth'});
}

function animateNext() {
    let delay = skipChatAnimation ? 100 : baseDelay;
    function animateBubble() {
        if(messageIndex >= bubbles.length) return;

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
    timeoutId = setTimeout(() => {
        if(messageIndex < bubbles.length) {
            animateNext(++messageIndex);
            if(messageIndex === bubbles.length - 1) onAutochatEnd(false);
        }
    }, delay)
}
animateNext();

chat.addEventListener('scroll', () => {
    scrollGradient.style.height = Math.min(30, chat.scrollTop) + 'px';
})

function onAutochatEnd(isSkipped) {
    const skip = document.getElementById('skip-btn');

    if(skip) {
        skip.className += 'animate__animated animate__fadeOutDown animate__faster';
        skip.addEventListener('animationend', () => skip.remove(), {once: true});
    }

    if(isSkipped) {
        clearTimeout(timeoutId);
        if(messageIndex < bubbles.length) {
            animateNext(messageIndex + 1);
        }
    }
}
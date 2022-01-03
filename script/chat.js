class ChatBubble extends HTMLElement {
    constructor(_type, _text, _image, _hasTail, _onClick) {
        super();

        // in/out
        const type = _type ? _type : this.getAttribute('type');
        this.className = 'bubble bubble-' + type;
        this.style.display = 'none';

        const message = document.createElement('div');
        message.className = 'msg msg-' + type;

        const messageSpan = document.createElement('span');
        messageSpan.innerHTML = _text ? _text : this.getAttribute('data-text');

        message.appendChild(messageSpan);

        const hasTail = _hasTail !== false && this.getAttribute('tail') !== 'none';
        const tail = document.createElement('div');
        tail.className = 'bubble-tail';

        if(_image || this.hasAttribute('data-image')) {
            const image = document.createElement('img');
            image.setAttribute('src', _image ? image : this.getAttribute('data-image'));
            message.insertBefore(image, messageSpan);
        }

        if(_onClick) this.addEventListener('click', _onClick);

        if(!hasTail) {
            this.append(message);
        } else if(type === 'out') {
            this.append(message, tail);
        } else {
            this.append(tail, message);
        }
    }
}

class OptionBubble extends ChatBubble {
    constructor() {
        super('out', null, null, false, () => {
            if(this.className.indexOf('disabled') !== -1 || interactiveChatLocked) return;
            this.className += ' disabled';
            lockAutochat();
            interactiveChatUsed = true;

            const spacer = chat.querySelector('#chat-spacer');

            const questionBubble = new ChatBubble('out', this.getAttribute('data-text'));
            chat.insertBefore(questionBubble, spacer);

            this.getAttribute('data-reply').split('|').forEach((reply) => {
                const replyBubble = new ChatBubble('in', reply);
                chat.insertBefore(replyBubble, spacer);
            })

            animateNext(true);

            scrollToBottom();
        });
    }
}

customElements.define('msg-bubble', ChatBubble);
customElements.define('option-bubble', OptionBubble);

let skipChatAnimation = false;
let messageIndex = 0;
let timeoutId;
let autochatEnded = false;
let interactiveChatUsed = false;
let interactiveChatLocked = false;
const baseDelay = 1500;
const chat = document.getElementById('chat');
const bubbles = chat.getElementsByTagName('msg-bubble');
const scrollGradient = document.getElementById('chat-scroll-gradient');
const options = document.getElementById('chat-options');

function scrollToBottom(bubble) {
    const isMobile = document.body.clientWidth <= 768;
    if(isMobile) {
        const targetBubble = bubble ? bubble : bubbles[bubbles.length - 1];
        targetBubble.scrollIntoView({behavior: 'smooth'});
        return;
    }

    const top = bubble ? chat.scrollTop + bubble.offsetHeight : chat.scrollHeight;
    chat.scrollTo({top: top, behavior: 'smooth'});
}

function animateBubble(bubble, ignoreSkip) {
    const isSkipped = skipChatAnimation && ignoreSkip !== true;
    let delay = isSkipped ? 100 : baseDelay;

    const animate = 'animate__animated animate__fadeInUp';
    bubble.style.display = '';
    if(!isSkipped) {
        delay += bubble.querySelector('span').textContent.length * 15;
        scrollToBottom(bubble);
    }
    bubble.className += ' ' + animate;

    return delay;
}

function animateNext(ignoreSkip) {
    if(messageIndex < bubbles.length) {
        const delay = animateBubble(bubbles[messageIndex], ignoreSkip);
        timeoutId = setTimeout(() => {
            if (messageIndex < bubbles.length) {
                messageIndex++;
                animateNext(ignoreSkip);
                if (messageIndex === bubbles.length - 1) {
                    if(interactiveChatUsed) unlockAutochat();
                    onAutochatEnd(false);
                }
            } else {
                clearTimeout(timeoutId);
                unlockAutochat();
            }
        }, delay);
    }
}
animateNext();

chat.addEventListener('scroll', () => {
    scrollGradient.style.height = Math.min(30, chat.scrollTop) + 'px';
})

function onAutochatEnd(isSkipped) {
    if(autochatEnded) return;
    autochatEnded = true;

    const animate = ' animate__animated animate__'

    const skip = document.getElementById('skip-btn');

    if(skip) {
        skip.className += animate + 'fadeOutDown animate__faster';
        skip.addEventListener('animationend', () => {
            skip.remove()
            const optionBubbles = options.getElementsByTagName('option-bubble');

            for (const option of optionBubbles) {
                option.className += animate + 'fadeIn';
                option.style.display = '';
            }
        }, {once: true});
    }

    if(isSkipped) {
        clearTimeout(timeoutId);
        if(messageIndex < bubbles.length) {
            animateNext(messageIndex + 1);
        }
    }
}

function lockAutochat() {
    options.className = 'locked';
    interactiveChatLocked = true;
}

function unlockAutochat() {
    options.className = 'unlocked';
    interactiveChatLocked = false;
}
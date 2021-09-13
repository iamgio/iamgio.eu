class Footer extends HTMLElement {

    constructor() {
        super();

        const buttons = new Map([
            ['github', 'https://github.com/iAmGio'],
            ['telegram', 'https://t.me/iAmGio'],
            ['discord', 'https://discord.com/users/334775433612492820'],
        ]);

        for (const [name, url] of buttons.entries()) {
            const button = document.createElement('a');
            button.setAttribute('href', url);
            button.setAttribute('target', '_blank');
            button.style.backgroundImage = 'url("assets/' + name + '.svg")';

            this.appendChild(button);
        }
    }
}

customElements.define('page-footer', Footer);
const element = document.getElementById('arg');
const args = ['programmer', 'designer', 'student'];

function setArg(i = 0) {
    if (i === args.length) {
        element.innerText = 'programmer, designer and student.';
        let opacity = 0;
        setInterval(() => {
            if (opacity > 1) return;
            element.style.opacity = opacity.toString();
            opacity += .1;
        }, 40);
    } else {
        element.innerText = args[i];
        setTimeout(() => setArg(i + 1), 1000);
    }
}
setArg();

let gradientElement = document.getElementsByClassName('gradient')[0];
const gradientStartStyle = '--gradient-start';
const gradientEndStyle = '--gradient-end';
let hslDegrees = 200;

function calcHslValue(hsl) {
    return 'hsl(' + hsl + ', 60%, 40%)';
}

function updateGradient() {
    gradientElement.style.setProperty(gradientStartStyle, calcHslValue(hslDegrees));
    gradientElement.style.setProperty(gradientEndStyle, calcHslValue(hslDegrees + 60))
}

function calculateAge() {
    const birthday = new Date('2002-05-27');
    const now = new Date();
    const ynew = now.getFullYear();
    const mnew = now.getMonth();
    const dnew = now.getDate();
    const yold = birthday.getFullYear();
    const mold = birthday.getMonth();
    const dold = birthday.getDate();
    let diff = ynew - yold;
    if (mold > mnew) diff--;
    else {
        if (mold === mnew) {
            if (dold > dnew) diff--;
        }
    }
    document.getElementById('age').textContent = diff.toString()// Math.abs(ageDate.getUTCFullYear() - 1970).toString();
}

calculateAge()
setInterval(() => {
    hslDegrees++;
    updateGradient()
}, 50)

particlesJS.load('particles-js', 'assets/particlesjs-config.json');
'use strict';
document.addEventListener('DOMContentLoaded', () => {

    //screen keyboard
    {
        const keyboardButton = document.querySelector('.search-form__keyboard');
        const keyboard = document.querySelector('.keyboard');
        const closeKeyboard = document.getElementById('close-keyboard');
        const searchInput = document.querySelector('.search-form__input');

        const toggleKeyboard = () => {
            keyboard.style.top = keyboard.style.top ? '' : '50%';
        };

        const typing = event => {
            const target = event.target;

            if (target.tagName.toLocaleLowerCase() === 'button') {
                if (target.id === 'keyboard-backspace') {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else {
                    searchInput.value += target.textContent.trim() ? target.textContent.trim() : ' ';
                }
            }
        };

        keyboardButton.addEventListener('click', toggleKeyboard);
        closeKeyboard.addEventListener('click', toggleKeyboard);
        keyboard.addEventListener('click', typing);
    }

    //menu
    {
        const burger = document.querySelector('.spinner');
        const sidebarMenu = document.querySelector('.sidebarMenu');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            sidebarMenu.classList.toggle('rollUp');
        });
        sidebarMenu.addEventListener('click', e => {
            let target = e.target;
            target = target.closest('a[href="#"]');

            if (target) {
                const parentTarget = target.parentNode;
                sidebarMenu.querySelectorAll('li').forEach(elem => {
                    if (elem === parentTarget) {
                        elem.classList.add('active');
                    } else {
                        elem.classList.remove('active');
                    }
                });
            }
        });
    }

});
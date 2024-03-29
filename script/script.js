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

        const changeLang = (btn, lang) => {
            const langRu = ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
                'en', ' '
            ];
            const langEn = ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
                'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
                'ru', ' '
            ];

            if (lang === 'en') {
                btn.forEach((elem, i) => {
                    elem.textContent = langEn[i];
                });
            } else {
                btn.forEach((elem, i) => {
                    elem.textContent = langRu[i];
                });
            }
        };

        const typing = event => {
            const target = event.target;

            if (target.tagName.toLocaleLowerCase() === 'button') {
                const contentButton = target.textContent.trim();
                const buttons = [...keyboard.querySelectorAll('button')]
                    .filter(elem => elem.style.visibility !== 'hidden');

                if (target.id === 'keyboard-backspace') {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else if (contentButton === 'en' || contentButton === 'ru') {
                    changeLang(buttons, contentButton);
                } else {
                    searchInput.value += contentButton ? contentButton : ' ';
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

    const youtuber = () => {
        const youTuberItems = document.querySelectorAll('[data-youtuber]');
        const youTuberModal = document.querySelector('.youTuberModal');
        const youTuberContainer = document.getElementById('youtuberContainer');

        const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
        const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

        const sizeVideo = () => {
            const ww = document.documentElement.clientWidth;
            const wh = document.documentElement.clientHeight;

            for (let i = 0; i < qw.length; i++) {
                if (ww > qw[i]) {
                    youTuberContainer.querySelector('iframe').style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                    `;
                    youTuberContainer.style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                        top: ${(wh - qh[i]) / 2}px;
                        left: ${(ww - qw[i]) / 2}px;
                    `;
                    break;
                }
            }
        };

        youTuberItems.forEach(elem => {
            elem.addEventListener('click', () => {
                const idVideo = elem.dataset.youtuber;
                youTuberModal.style.display = 'block';

                window.setTimeout(function () {
                    youTuberModal.style.opacity = 1;
                    youTuberModal.style.transition = '0.3s linear opacity';
                }, 0);

                const youTuberFrame = document.createElement('iframe');
                youTuberFrame.style.border = 'transparent';
                youTuberFrame.src = `https://youtube.com/embed/${idVideo}`;
                youTuberContainer.insertAdjacentElement('beforeend', youTuberFrame);

                window.addEventListener('resize', sizeVideo);

                sizeVideo();
            });
        });

        youTuberModal.addEventListener('click', () => {
            youTuberModal.style.opacity = 0;
            youTuberModal.style.transition = '0.3s linear opacity';

            window.setTimeout(function () {
                youTuberModal.style.display = '';
                youTuberContainer.textContent = '';
                window.removeEventListener('resize', sizeVideo);
            }, 700);
        });
    };

    //modal
    {
        document.body.insertAdjacentHTML('beforeend', `
                                                <div class="youTuberModal" style="opacity: 0;">
                                                    <div id="youtuberClose">&#215;</div>
                                                    <div id="youtuberContainer"></div>
                                                </div>
                                                `);
        youtuber();
    }

    //API
    {
        const API_KEY = 'key';
        const CLIENT_ID = 'clientId';

        //auth
        {
            const buttonAuth = document.getElementById('authorize');
            const blockAuth = document.querySelector('.auth');

            const errorAuth = err => {
                console.error(err);
                blockAuth.style.display = '';
            };

            gapi.load("client:auth2", () => gapi.auth2.init({client_id: CLIENT_ID}));

            const authenticate = () => gapi.auth2.getAuthInstance()
                .signIn({scope: 'https://www.googleapis.com/auth/youtube.readonly'})
                .then(() => console.log('Sing-in successful'))
                .catch(errorAuth);

            const loadClient = () => {
                gapi.client.setApiKey(API_KEY);
                return gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
                    .then(() => console.log('GAPI client loaded for API'))
                    .then(() => blockAuth.style.display = 'none')
                    .catch(errorAuth);
            };

            buttonAuth.addEventListener('click', () => authenticate().then(loadClient));
        }

        //request
        {
            const gloTube = document.querySelector('.logo-academy');
            const trends = document.getElementById('yt_trend');
            const like = document.getElementById('like');
            const main = document.getElementById('yt_main');

            const request = options => gapi.client.youtube[options.method]
                .list(options)
                .then(response => response.result.items)
                .then(render)
                .then(youtuber)
                .catch(err => console.error("Request error: " + err));

            const render = data => {
                console.log(data);
                const ytWrapper = document.getElementById('yt-wrapper');
                ytWrapper.textContent = '';
                data.forEach(item => {
                    try {
                        const {
                            id, id: {videoId}, //JSON field: {new variable with field content}
                            snippet: {
                                channelTitle,
                                title,
                                resourceId: {
                                    videoId: likedVideoId
                                } = {},
                                thumbnails: {high: {url}}
                            }
                        } = item;
                        ytWrapper.innerHTML += `
                        <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
                            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                            </div>
                            <div class="yt-title">${title}</div>
                            <div class="yt-channel">${channelTitle}</div>
                        </div>
                    `;
                    } catch (err) {
                        console.error(err);
                    }
                });
            };

            //videos from specified channel with id {channelId}
            gloTube.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
                    order: 'date',
                    maxResults: 6,
                });
            });

            //most popular videos (trends) in region {regionCode}
            trends.addEventListener('click', () => {
                request({
                    method: 'videos',
                    part: 'snippet',
                    chart: 'mostPopular',
                    maxResults: 6,
                    regionCode: 'RU',
                });
            });

            //videos from playlist with id {playlistId}
            like.addEventListener('click', () => {
                request({
                    method: 'playlistItems',
                    part: 'snippet',
                    playlistId: 'LL84qG9izkzQEauvC23fDEFg',
                    maxResults: 6,
                });
            });

            //search videos by string 'cute animals'
            main.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    type: 'video',
                    order: 'rating',
                    q: 'cute animals',
                    maxResults: 6,
                });
            });
        }
    }
});
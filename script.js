document.addEventListener('DOMContentLoaded', () => {
    // Referanser til DOM-elementer
    const toggleManagerBtn = document.getElementById('toggle-manager-btn');
    const toggleChatBtn = document.getElementById('toggle-chat-btn');
    const chatSidebar = document.getElementById('chat-sidebar');
    const streamManagerSidebar = document.getElementById('stream-manager-sidebar');
    const streamInputArea = document.getElementById('stream-input-area');
    const addInputBtn = document.getElementById('add-input-btn');
    const saveStreamsBtn = document.getElementById('save-streams-btn');
    const videoArea = document.getElementById('video-area');
    const chatContent = document.getElementById('chat-content');

    // Start med begge sidepaneler skjult som standard
    chatSidebar.classList.add('hidden');
    streamManagerSidebar.classList.add('hidden');

    // --- 1. Håndter Panel Toggles ---
    toggleManagerBtn.addEventListener('click', () => {
        streamManagerSidebar.classList.toggle('hidden');
        toggleManagerBtn.textContent = streamManagerSidebar.classList.contains('hidden') ? 'Manage Streams' : 'Close Manager';
    });

    toggleChatBtn.addEventListener('click', () => {
        chatSidebar.classList.toggle('hidden');
        toggleChatBtn.textContent = chatSidebar.classList.contains('hidden') ? 'Show Chat' : 'Hide Chat';
    });
    
    // --- 2. Håndter dynamiske input-felt ---
    function createStreamInputGroup() {
        const group = document.createElement('div');
        group.classList.add('stream-input-group');
        group.innerHTML = `
            <select class="service-select">
                <option value="twitch">Twitch</option>
                <option value="kick">Kick</option>
                <option value="youtube">YouTube</option>
            </select>
            <input type="text" class="channel-input" placeholder="Channel Name or Video ID">
        `;
        streamInputArea.appendChild(group);
    }
    createStreamInputGroup(); 
    addInputBtn.addEventListener('click', createStreamInputGroup);

    // --- 3. Håndter lagring og oppdatering av videovisning ---
    saveStreamsBtn.addEventListener('click', updateVideoLayout); 

    function updateVideoLayout() {
        const inputs = document.querySelectorAll('.stream-input-group');
        videoArea.innerHTML = ''; // Tømmer eksisterende videoer
        
        const validStreams = [];
        // window.location.hostname er domenet du kjører fra (f.eks. localhost eller din RasPi IP)
        // ERSTATT 'WANIPADRESSE' med din eksakte offentlige IP eller domenenavn (uten http:// eller /)
        const hostname = 'muixun.github.io'; 

        inputs.forEach(group => {
            const service = group.querySelector('.service-select').value;
            const channel = group.querySelector('.channel-input').value.trim();

            if (channel) {
                validStreams.push({ service, channel });
            }
        });

        validStreams.forEach(stream => {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-wrapper');
            // Legger til klikk-event for å bytte chat
            videoContainer.addEventListener('click', () => switchChat(stream.service, stream.channel));
            
            let iframeSrc = '';
            if (stream.service === 'twitch') {
                // KORRIGERT: Bruker backticks (`) og https://
                iframeSrc = `player.twitch.tv{stream.channel}&parent=${hostname}&muted=false&autoplay=true`;
            } else if (stream.service === 'kick') {
                // KORRIGERT: Bruker backticks (`) og https://
                iframeSrc = `player.kick.com{stream.channel}&parent=${hostname}&muted=false&autoplay=true`;
            } else if (stream.service === 'youtube') {
                // KORRIGERT: Bruker backticks (`) og https://
                iframeSrc = `www.youtube.com{stream.channel}?autoplay=1&mute=0&enablejsapi=1`;
            }

            // KORRIGERT: Bruker backticks (`) for innerHTML
            videoContainer.innerHTML = `<iframe src="${iframeSrc}" frameborder="0" allowfullscreen="true" scrolling="no" height="100%" width="100%"></iframe>`;
            videoArea.appendChild(videoContainer);
        });

        // Lukk manager-panelet automatisk etter oppdatering
        streamManagerSidebar.classList.add('hidden');
        toggleManagerBtn.textContent = 'Manage Streams';
    }

    // --- 4. Håndter Chat-bytte ---

    function switchChat(service, channel) {
        // Bruk hostname-variabelen definert over for konsistens
        const hostname = 'muixun.github.io'; 
        let chatSrc = '';
        if (service === 'twitch') {
            // KORRIGERT: Bruker backticks (`) og https://
            chatSrc = `www.twitch.tv{channel}/chat?parent=${hostname}`;
        } else if (service === 'kick') {
             // KORRIGERT: Bruker backticks (`) og https://
             chatSrc = `kick.com{channel}/chatroom`; 
        } else if (service === 'youtube') {
            chatContent.innerHTML = `<p style="padding: 20px;">YouTube chat embedding requires complex API setup. Currently showing placeholder for ${channel}.</p>`;
            // Vi avslutter funksjonen her for YouTube siden vi ikke har en iframe-URL
            if (chatSidebar.classList.contains('hidden')) {
                chatSidebar.classList.remove('hidden');
                toggleChatBtn.textContent = 'Hide Chat';
            }
            return; 
        }
        
        // For Twitch og Kick (KORRIGERT: Bruker backticks `)
        chatContent.innerHTML = `<iframe src="${chatSrc}" frameborder="0" scrolling="yes" height="100%" width="100%"></iframe>`;
        
        if (chatSidebar.classList.contains('hidden')) {
            chatSidebar.classList.remove('hidden');
            toggleChatBtn.textContent = 'Hide Chat';
        }
    }
});

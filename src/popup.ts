import { content } from './content-script';

loadApiKey()
showLatestTranscript()

document.getElementById('start')?.addEventListener('click', async () => {
    const tab = await getCurrentTab()
    if(!tab) return alert('Require an active tab')
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: content,
    })
})

document.getElementById('stop')?.addEventListener('click', async () => {
    const tab = await getCurrentTab()
    if(!tab) return alert('Require an active tab')
    chrome.tabs.sendMessage(tab.id, { message: 'stop' })
})

chrome.runtime.onMessage.addListener(({ message }) => {
    if(message == 'transcriptavailable') {
        showLatestTranscript()
    }
})

function loadApiKey() {
    chrome.storage.local.get('key').then(({ key }) => {
        const apiKeyElem = document.getElementById('api-key') as HTMLInputElement | null
        if (apiKeyElem) {
            apiKeyElem.value = key
        }
    })
}

function showLatestTranscript() {
    chrome.storage.local.get("transcript", ({ transcript }) => {
       document.getElementById('transcript').innerHTML = transcript;
       transcript && document.getElementById('clear')?.removeAttribute('disabled');
    })
}

function clearTranscript() {
    chrome.storage.local.set({"transcript": ""});
    document.getElementById('transcript').innerHTML = "";
    document.getElementById('clear').disabled = true;
}

document.getElementById('clear')?.addEventListener('click', () => clearTranscript())

async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    console.log({tab})
    return tab
}

const togglePassword = document.getElementById('togglePassword')
const APIKey = document.getElementById('api-key')

togglePassword?.addEventListener('click', function(){
    const type = APIKey?.getAttribute('type') === 'password' ? 'text' : 'password'
    APIKey?.setAttribute('type', type)
    this.classList.toggle('fa-eye')
})
const { desktopCapturer, remote } = require('electron');

const videoElement = document.querySelector('video');
const screenSelectButton = document.getElementById('select-screen-btn');

async function selectSource(source) {
  screenSelectButton.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  videoElement.srcObject = stream;
  videoElement.play();
}

async function getAllScreens() {
  const inputSources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
  });

  const videoOptionsMenu = remote.Menu.buildFromTemplate(
    inputSources.map((source) => {
      return {
        label: source.name,
        click: () => selectSource(source),
      };
    })
  );

  videoOptionsMenu.popup();
}

screenSelectButton.addEventListener('click', getAllScreens);

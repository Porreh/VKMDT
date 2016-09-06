class Downloader {
  saveFile(url, artist, title) {
    if (this.checkType(url)) {
      let filename = `${artist} - ${title}.mp3`;
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open('GET', url, true);
      xhr.send();
      console.log(`Загрузка: "${filename}"`);
    } else {
      console.warn(`Сервер не поддерживает кросс-доменные запросы!`);
    }
  }

  checkType(url) {
    fetch(url, {mode: 'no-cors'})
      .then(r => {
        console.log(r);
        if (r.type == 'cors') {
          return true;
        } else {
          return false;
        }
      });
  }

  getFiles(audioData) {
    for (let audio of audioData) {
      this.saveFile(audio.url, audio.artist, audio.title);
    }
  }
}

class VKI {
  constructor() {
    this.id;
  }

  getStatus() {
    let object;
    VK.Auth.getLoginStatus(response => object = response);
    return object;
  }

  getSession() { // DON'T WORK
    let object;
    VK.Auth.getSession(response => object = response);
    return object;
  }

  setID(newID) {
    this.id = newID;
    console.info(`USER ID - ${this.id}`);
  }

  setUserID() {
    // TODO: CHANGE TO getSession();
    let response = this.getStatus();
    let userID = response.session.mid;
    this.setID(userID);
  }

  logIN() {
    VK.Auth.login(function (response) {
      if (response.session) {
        console.info(`Авторизация прошла успешно.`);
      } else {
        console.info(`Не удалось авторизоваться.`);
      }
    }, 8);
  }

  logOUT() {
    VK.Auth.logout(() => console.info('Сессия завершина.'));
  }

  load() {
    let self = this;
    let response = this.getStatus();

    if (response.session) {
      self.setUserID();
    } else {
      VK.Observer.subscribe('auth.login', x => self.setUserID());
      self.logIN();
    }
  }

  getAllAudioData(ID) {
    let id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {
      owner_id: id
    }, function (x) {
      if (x.error) {
        console.warn(x.error.error_msg);
      } else {
        let audioData = [];
        for (let i = 1; i <= x.response[0]; i++) {
          let r = x.response;
          console.log(r[i].url);
          audioData.push({
              'url': r[i].url,
              'artist': r[i].artist,
              'title': r[i].title
          });
        }
        console.log(audioData);
      }
    });
  }
}

VK.Auth.getLoginStatus();
let vk = new VKI();
let downloader = new Downloader();

function getAllSongs(ID) {
  let audioData = vk.getAllAudioData(ID);
  console.log(audioData);
  return;
}

let file = [{
  artist: "BONES",
  title: "Rocks",
  url: "https://psv4.vk.me/c611324/u53381224/audios/70fecda5c268.mp3?extra=piaGcQzzxz2bqQ-vwe6KlwQfSgpsOsrnLmgFv1Ea3sc-Jft5Rh3iFufIIprXvicsFisbTba99G7Vg9pHUesCTTtDOk0GVa2-pmNPpRosr_c5x_H9Fg-WYRrdPCIJgIxfkOrcdqSCoTAY"
}];

//getAllSongs(254268339);
//getAllSongs(126655314); Denied

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function (event) {
  event.preventDefault();
  vk.load();
});

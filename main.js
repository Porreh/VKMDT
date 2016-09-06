class Downloader {
  saveFile(url, artist, title) {
    fetch(url)
      .then(response => {
        if (response.type == 'cors') {
          console.log('cors');
        }
      })
      .catch(response => console.log(response));
    }
    
    console.log(checkType(url));
    
    // if (this.checkType(url)) {
    //   let filename = `${artist} - ${title}.mp3`;
    //   let xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = function () {
    //     let a = document.createElement('a');
    //     a.href = window.URL.createObjectURL(xhr.response);
    //     a.download = filename;
    //     a.style.display = 'none';
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    //   };
    //   xhr.open('GET', url, true);
    //   xhr.send();
    //   console.log(`Загрузка: "${filename}"`);
    // } else {
    //   console.warn(`Сервер не поддерживает кросс-доменные запросы!`);
    // }
  }

  files(audioData, callback) {
    if (audioData.error) {
      console.warn(audioData.error.error_msg);
    } else {
      for (let i = 1; i < audioData.response.length; i++) {
        callback(audioData.response[i].url, audioData.response[i].artist, audioData.response[i].title);
      }
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

  getAudioData(ID, callback, fn) {
    let id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', { owner_id: id }, x => callback(x, fn));
  }
}

VK.Auth.getLoginStatus();
let self = this;
let vk = new VKI();
let download = new Downloader();


function getAllSongs() {
  vk.getAudioData(null, download.files);
}

function getAllFriendSongs(ID) {
  vk.getAudioData(ID, download.files, download.saveFile);
}


//getAllSongs(254268339);
//getAllSongs(126655314); Denied

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function (event) {
  event.preventDefault();
  vk.load();
});

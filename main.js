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
    fetch(url, {
        mode: 'no-cors'
      })
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
    let arr = audioData;
    console.log(arr.length);
    arr.forEach(x => console.log(x));
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

  getAllAudioData(ID, callback) {
    let id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {
      owner_id: id
    }, function (x) {
      if (x.error) {
        console.warn(x.error.error_msg);
      } else {
        let audioData = [];
        for (let i = 1; i < x.response.length; i++) {
          audioData.push({
            'url': x.response[i].url,
            'artist': x.response[i].artist,
            'title': x.response[i].title
          });
        }
        callback(audioData);
      }
    });
  }
}

VK.Auth.getLoginStatus();
let vk = new VKI();
let downloader = new Downloader();

function getAllSongs(ID) {
  vk.getAllAudioData(ID, downloader.getFiles());
}

//getAllSongs(254268339);
//getAllSongs(126655314); Denied

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function (event) {
  event.preventDefault();
  vk.load();
});

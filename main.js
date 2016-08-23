class Downloader {
  saveFile(url, artist, title) {
    let filename = `${artist} - ${title}.mp3`;
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  getFiles(audioData) {
    for(let audio of audioData) {
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
    VK.Auth.login(function(response) {
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
    
    if(response.session) {
      self.setUserID();
    } else {
      VK.Observer.subscribe('auth.login', x => self.setUserID());
      self.logIN();
    }
  }
  
  getAllAudioData(ID, COUNT) {
    let audioData = [],
        id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {owner_id: id}, function(x) {
      let count = (COUNT) ? COUNT : x.response.length;
      for(let i = 1; i < 500; i++) {
        let url = x.response[i].url,
            artist = x.response[i].artist,
            title = x.response[i].title;
        audioData.push({'url': url, 'artist': artist, 'title': title});
      }
    });
    return audioData;
  }
}

VK.Auth.getLoginStatus();
let vk = new VKI();
let downloader = new Downloader();

//downloader.getFiles(vk.getAllAudioData());

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function(event){
  event.preventDefault();
  vk.load();
});

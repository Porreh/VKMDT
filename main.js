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
    console.log(`Загрузка: "${filename}"`);
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
  
  getAllAudioData(ID) {
    let audioData = [],
        id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {owner_id: id}, function(x) {
      for(let i = 1; i < x.response.length; i++) {
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

let file = [{
  artist: "BONES",
  title: "Rocks",
  url: "https://psv4.vk.me/c611324/u53381224/audios/70fecda5c268.mp3?extra=piaGcQzzxz2bqQ-vwe6KlwQfSgpsOsrnLmgFv1Ea3sc-Jft5Rh3iFufIIprXvicsFisbTba99G7Vg9pHUesCTTtDOk0GVa2-pmNPpRosr_c5x_H9Fg-WYRrdPCIJgIxfkOrcdqSCoTAY"
}]

function getAllSongs(ID) {
  let audioData = vk.getAllAudioData(ID);
  return audioData;
}

function downloadAllSongs(ID = vk.id) {
  downloader.getFiles(getAllSongs(ID));
  //downloader.getFiles(file);
}

//downloader.getFiles(vk.getAllAudioData());
//downloader.getFiles(vk.getAllAudioData(126655314));

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function(event){
  event.preventDefault();
  vk.load();
});

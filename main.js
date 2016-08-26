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
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.send();
    console.log(`Загрузка: "${filename}"`);
  }
  
  // saveFile2(x) {
  //   let a = document.createElement('a');
  //   a.href = window.URL.createObjectURL(x);
  //   a.download = `song${String(Math.random()).slice(-6)}.mp3`;
  //   a.style.display = 'none';
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   //console.log(`Загрузка: "${filename}"`);
  // }
  
  saveFiles3(url, artist, title) {
    fetch(url)  
      .then(  
        function(response) {  
          if (response.status !== 200) {  
            console.log('Looks like there was a problem. Status Code: ' +  
            response.status);  
            return;  
          }
          
          response.json().then(function(data) {  
            console.log(data);  
          });  
        }
      )
      .catch(function(err) {  
        console.log('Fetch Error :-S', err);  
      });
  }
  
  log(x) {
    console.info(x);
  }

  scriptRequest(url, onSuccess, onError) {
    let scriptOk = false;
    let callbackName = `CB${String(Math.random()).slice(-6)}`;
    url += ~url.indexOf('?') ? '&' : '?';
    url += 'callback=CallbackRegistry.' + callbackName;

    CallbackRegistry[callbackName] = function(data) {
      scriptOk = true;
      delete CallbackRegistry[callbackName];
      onSuccess(data);
    };
    
    function checkCallback() {
      if (scriptOk) return;
      delete CallbackRegistry[callbackName];
      onError(url);
    }
    
    let script = document.createElement('script');
    script.onreadystatechange = function() {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        this.onreadystatechange = null;
        setTimeout(checkCallback, 0);
      }
    }
    script.onload = script.onerror = checkCallback;
    script.src = url;

    document.body.appendChild(script);
  }

  getFiles(audioData) {
    let self = this;
    for (let audio of audioData) {
      this.saveFile(audio.url, audio.artist, audio.title);
      //this.scriptRequest(audio.url, self.log, self.log);
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

    if (response.session) {
      self.setUserID();
    } else {
      VK.Observer.subscribe('auth.login', x => self.setUserID());
      self.logIN();
    }
  }

  getAllAudioData(ID) {
    let audioData = [],
      id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {
      owner_id: id
    }, function(x) {
      for (let i = 1; i < x.response.length; i++) {
        let url = x.response[i].url,
          artist = x.response[i].artist,
          title = x.response[i].title;
        audioData.push({
          'url': url,
          'artist': artist,
          'title': title
        });
      }
    });
    return audioData;
  }
}

VK.Auth.getLoginStatus();
let vk = new VKI();
let downloader = new Downloader();
let CallbackRegistry = {};

function getAllSongs(ID) {
  let audioData = vk.getAllAudioData(ID);
  return audioData;
}

function downloadAllSongs(ID = vk.id) {
  downloader.getFiles(getAllSongs(ID));
  //downloader.getFiles(file);
}

let file = [{
  artist: "BONES",
  title: "Rocks",
  url: "https://psv4.vk.me/c611324/u53381224/audios/70fecda5c268.mp3?extra=piaGcQzzxz2bqQ-vwe6KlwQfSgpsOsrnLmgFv1Ea3sc-Jft5Rh3iFufIIprXvicsFisbTba99G7Vg9pHUesCTTtDOk0GVa2-pmNPpRosr_c5x_H9Fg-WYRrdPCIJgIxfkOrcdqSCoTAY"
}];

let fileVK = getAllSongs(126655314);

//downloader.getFiles(vk.getAllAudioData());
//downloader.getFiles(vk.getAllAudioData(126655314));

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function(event) {
  event.preventDefault();
  vk.load();
});

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

  getFiles(dataArray) {
    for(let obj of dataArray) {
      this.saveFile(obj.url, obj.artist, obj.title);
    }
  }
}

class VKI {
  constructor() {
    this.id;
  }
  
  getStatus() { // DONE
    let object;
    VK.Auth.getLoginStatus(response => object = response);
    return object;
  }
  
  getSession() { // DON'T WORK
    let object;
    VK.Auth.getSession(response => object = response);
    return object;
  }
  
  setID(newID) { // DONE
    this.id = newID;
    console.info(`USER ID - ${this.id}`);
  }
  
  setUserID() { // DONE
    // TODO: CHANGE TO getSession();
    let response = this.getStatus();
    let userID = response.session.mid;
    this.setID(userID);
  }

  logIN() { // DONE
    VK.Auth.login(function(response) {
      if (response.session) {
        console.info(`Авторизация прошла успешно.`);
      } else {
        console.info(`Не удалось авторизоваться.`);
      }
    }, 8);
  }

  logOUT() { // DONE
    VK.Auth.logout(() => console.info('Сессия завершина.'));
  }

  load() { // NEED WORK
    let self = this;
    let response = this.getStatus();
    
    if(response.session) {
      self.setUserID();
    } else {
      VK.Observer.subscribe('auth.login', x => self.setUserID());
      self.logIN();
      VK.Observer.unsubscribe('auth.login', () => {});
      self.logIN();
    }
  }
  
  //getAllAudioData(ID) { // NEED WORK
  //  let audioData = [];
  //  let id = (ID) ? ID : this.id;
  //  VK.Api.call('audio.get', {owner_id: id}, function(x) {
  //    for(let i = 1; i < x.response.length; i++) {
  //      let url = x.response[i].url,
  //          artist = x.response[i].artist,
  //          title = x.response[i].title;
  //      audioData.push({'url': url, 'artist': artist, 'title': title});
  //    }
  //  });
  //  return audioData;
  //}
}

VK.Auth.getLoginStatus();
let vk = new VKI();
let downloader = new Downloader();



//let musicData = vk.getAudioData();

let btn = document.querySelector(".startbutton");
btn.addEventListener("click", function(event){
	event.preventDefault();
	vk.load();
});

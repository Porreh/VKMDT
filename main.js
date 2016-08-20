class Downloader {
  constructor(linkList) {
    this.linkList = linkList;
  }

  saveFile(url) {
    let filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
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

  getFiles(linkList) {
    for(let link of (this.linkList || linkList)) {
      this.saveFile(link);
      console.log(link);
    }
  }
}

class Parser {
  constructor() {

  }
  
  split() {
    
  }
  
}

class LinkGenerator {
  constructor() {
    
  }
}

class VKData {
  constructor() {
    let fname;
    let lname;
    let id;
  }

  logIn(response) {
    if(response.status == 'connected') {
      if(typeof(response.session.user) == 'undefined') {
        VK.Api.call('users.get', { uid: response.session.mid }, function(r) { 
          fname = r.response[0].first_name;
          lname = r.response[0].last_name; 
          id = response.session.mid;
        });
      } else {   
        fname = response.session.user.first_name;
        lname = response.session.user.last_name;
        id = response.session.mid;
      } 
    } else {
      VK.Auth.login(this.logIn);
    }
  }

  start() {
    VK.Auth.getLoginStatus(this.logIn);
  }

  getData() {
    return `${fname} ${lname} ID:${id}` 
  }
}

let data = new VKData();
data.start();
console.log(data.getData());

// Album Class: Represents a Album - create Object constructor function
class BandAlbum {
    //Method which runs when instantiate the album
    constructor(bandName, albumName) {
        //Object that owns the code - becomes object itself
        this.bandName = bandName;
        this.albumName = albumName;
    }
}

// UI Class: Handle UI Tasks
class UI {
    //Define static method for class - called directly on class
    //Static methods are called without instantiating their class and cannot be called through a class instance. Static methods are often used to create utility functions for an application
    static displayAlbums() {
        const albums = Store.getAlbums();

        //Loop through album within array & calling a method and passing album into it
        //Calls function once per each element in array - in order
        albums.forEach((album) => UI.addAlbumToList(album));
    }
    static addAlbumToList(album) {
        //Create row to add to DOM
        const list = document.getElementById('album-list');

        //Insert <tr> element
        const row = document.createElement('tr');

        row.innerHTML = `
      <td>${album.bandName}</td>
      <td>${album.albumName}</td>
      <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
      `;
        //Append row to list
        list.appendChild(row)
    }
    //Removing band and album field element/whole row
    static deleteAlbum(el) {
        //when we click, we need to be sure that containts class delete
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        } else {
            //Make sure that alert is not appearing when click on band or album
            Store.removeAlbums(e.target.parentElement.previousElementSibling.textContent);

            UI.showAlert('Album deleted', 'success');
        }
    }

    //two properties, one for messege and to style it
    static showAlert(messege, className) {
        //Building div where to put alert messeges
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(messege));
        const container = document.querySelector('.container');
        const form = document.getElementById('album-form');
        container.insertBefore(div, form);
        //Make vanish in 1.5 seconds
        setTimeout(() => document.querySelector('.alert').remove(),
            1500);
    }

    //Clering fields after input submit
    static clearFields() {
        document.getElementById('band').value = '';
        document.getElementById('album').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getAlbums() {
        let albums;
        if (localStorage.getItem('albums') === null) {
            albums = [];
        } else {
            albums = JSON.parse(localStorage.getItem('albums'));
        }
        return albums;
    }

    static addAlbums(album) {
        const albums = Store.getAlbums();
        albums.push(album);
        localStorage.setItem('albums', JSON.stringify(albums));
    }

    static removeAlbums(albumName) {
        const albums = Store.getAlbums();

        //Calls function once per each element in array
        albums.forEach((album, index) => {
            if (album.albumName === albumName) {
                albums.splice(index, 1);
            }
        });

        localStorage.setItem('albums', JSON.stringify(albums));
    }
}

// Event: Display Albums
// Loading albums from UI with displayAlbums method
document.addEventListener('DOMContentLoaded', UI.displayAlbums);

// Event: Add a Album
document.getElementById('album-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const bandName = document.getElementById('band').value;
    const albumName = document.getElementById('album').value;

    //Validate
    if (bandName === '' || albumName == '') {
        //calling method with messege and className
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //Instatiate album
        const album = new BandAlbum(bandName, albumName);

        //Add album to UI and pass album
        UI.addAlbumToList(album);

        //Add album to store
        Store.addAlbums(album);

        //Show succes 
        UI.showAlert('Album added', 'success');

        //Clear Fields method call
        UI.clearFields()
    }
});

//Event: Remove Album
document.getElementById('album-list').addEventListener('click', (e) => {
    //Passing target to method, deleting whole field, from UI
    UI.deleteAlbum(e.target)

    //Remove album for store
    Store.removeAlbums(e.target.parentElement.previousElementSibling.textContent);

    //Album deleted successfull 
    UI.showAlert('Album deleted', 'success');
});

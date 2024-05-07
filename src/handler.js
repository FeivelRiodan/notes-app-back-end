const { nanoid } = require('nanoid');
const notes = require('./notes');
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
 
    //nanoid adalah library untuk randomizer id
    const id = nanoid(16);

    //menambahkan informasi kapan dibuat dan update
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

          //push note
    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
      };
      notes.push(newNote);

            //mengecek apakah notes sudah masuk dalam array
      const isSuccess = notes.filter((note) => note.id === id).length > 0;
            if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(500);
      return response;
};

//untuk mengambil dan menampilkan notes yang sudah disave
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

//untuk melihat notes secara detail (diklik)
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const note = notes.filter((n) => n.id === id)[0];
 
 if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

//untuk edit note
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
 
  const index = notes.findIndex((note) => note.id === id);
 
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
 
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
 
//untuk menghapus note
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = notes.findIndex((note) => note.id === id);
 
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
 const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
 
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
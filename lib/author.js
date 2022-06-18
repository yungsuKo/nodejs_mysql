var db = require('./db.js')
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var path = require('path');

exports.home = function(request,response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error, authors){
        var title = 'Author';

        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        ${template.authorList(authors)}
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                border: 1px solid black;
            }
        </style>

        <form action = "/author/create_process" method="post">
            <p>
                <input type = "text" name= "name" placeholder="name">
            </p>
            <p>
                <textarea name="profile" placeholder="description"></textarea>
            </p>
            <p>    
                <input type = "submit">
            </p>
        </form>
        `,``
        );
        response.writeHead(200);
        response.end(html)
    })
  });
}

exports.create_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`insert into author (name, profile)
        values (?, ?)`,
        [post.name, post.profile], 
        function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
        })
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        db.query(`select * from topic`, function(error, topics){
            db.query('select * from author', function(error2, authors){
              var filteredId = path.parse(queryData.id).base;
              db.query(`SELECT * FROM author WHERE id = ?`,[queryData.id],function(error2, author){
                if(error2){
                  throw error2
                }
                var list = template.list(topics);
                var tag = template.authorSelect(authors, author[0].author_id);
                var html = template.HTML(author[0].title, list,
                  `
                ${template.authorList(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <input type="hidden" name="id" value="${author[0].id}">
                    <p>
                        <input type = "text" name= "name" placeholder="name" value="${author[0].name}">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description">${author[0].profile}</textarea>        
                    </p>
                    <p>
                        <input type="submit" value = "업데이트">
                    </p>
                </form>
                  `,
                  ``
                );
                response.writeHead(200);
                response.end(html);
                })
            });
          });
    });
}
exports.update_process = function(request,response){
    var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
    console.log(post)
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id], 
      function(error, results){
        response.writeHead(302, {Location: `/author`});
        response.end();
      })
  });
}
exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`DELETE FROM topic WHERE author_id = ?`, 
      [post.id], function(error, result){
        db.query(`DELETE FROM author WHERE id = ?`, [post.id], function(error2, result){
            if(error2){
              throw error2;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
          })
        });
    });
  }
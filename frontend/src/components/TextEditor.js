import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import io from 'socket.io-client';
import axios from 'axios';
import {connect} from 'react-redux';
import propTypes from 'prop-types' ;
import {logout} from '../actions/auth'
import './TextEditor.css'
import {Controlled as CodeMirror} from 'react-codemirror2'
import DownloadLink from "react-download-link";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Save';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CodeIcon from '@material-ui/icons/Code';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/theme/dracula.css");
require("codemirror/addon/hint/show-hint.js")
require("codemirror/addon/hint/show-hint.css")
require("codemirror/addon/hint/javascript-hint.js")
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchtags');
require('codemirror/keymap/sublime');

const socket = io('localhost:5000');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign:"left",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    color: "black",
    backgroundColor: "white",
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const TextEditor = ({logout}) => {
  const classes = useStyles();

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [language, setlanguage] = useState(50);

  // function downloadSource(){
  //   var value=50;
  //   download(Codetext,"main.c","text/plain");

  // }
  
    const  languages=[
        {
          "id": 45,
          "name": "Assembly (NASM 2.14.02)",
          "filename":"main.asm",
          "template":`section	.text
          global _start
      
      _start:
      
          xor	eax, eax
          lea	edx, [rax+len]
          mov	al, 1
          mov	esi, msg
          mov	edi, eax
          syscall
      
          xor	edi, edi
          lea	eax, [rdi+60]
          syscall
      
      section	.rodata
      
      msg	db 'hello, world', 0xa
      len	equ	$ - msg`

        },
        {
          "id": 46,
          "name": "Bash (5.0.0)",
          "filename":"script.sh",
          "template":`echo "hello, world"`
        },
        {
          "id": 47,
          "name": "Basic (FBC 1.07.1)",
          "filename":"main.bas",
          "template":`PRINT "hello, world"`
        },
        {
          "id": 48,
          "name": "C (GCC 7.4.0)",
          "filename":"main.c",
          "template":`#include <stdio.h>
          
int main(void) {
    printf("Hello Judge0!\\n");
    return 0;
}
          `
        },
        {
          "id": 52,
          "name": "C++ (GCC 7.4.0)",
          "filename":"main.cpp",
          "template":`#include <iostream>

int main() {
    std::cout << "hello, world" << std::endl;
    return 0;
}
          `
        },
        {
          "id": 49,
          "name": "C (GCC 8.3.0)",
          "filename":"main.cpp",
          "template":`#include <iostream>

int main() {
    std::cout << "hello, world" << std::endl;
    return 0;
}
          `
        },
        {
          "id": 53,
          "name": "C++ (GCC 8.3.0)",
          "filename":"main.c",
          "template":`#include <stdio.h>

          int main(void) {
              printf("Hello Judge0!\n");
              return 0;
          }
          `
        },
        {
          "id": 50,
          "name": "C (GCC 9.2.0)",
          "filename":"main.c",
          "template":`#include <stdio.h>
int main(void) {
  printf("Hello Judge0!\\n");
  return 0;
}`
        },
        {
          "id": 54,
          "name": "C++ (GCC 9.2.0)",
          "filename":"main.cpp",
          "template":`#include <iostream>

int main() {
    std::cout << "hello, world" << std::endl;
    return 0;
}
          `
        },
        {
          "id": 51,
          "name": "C# (Mono 6.6.0.161)",
          "filename":"Main.cs",
          "template":`public class Hello {
  public static void Main() {
      System.Console.WriteLine("hello, world");
  }
}
        `
        },
        {
          "id": 55,
          "name": "Common Lisp (SBCL 2.0.0)",
          "filename":"script.lisp",
          "template":`(write-line "hello, world")`
        },
        {
          "id": 56,
          "name": "D (DMD 2.089.1)",
          "filename":"main.d",
          "template":`import std.stdio;

void main()
{
    writeln("hello, world");
}
          `
        },
        {
          "id": 57,
          "name": "Elixir (1.9.4)",
          "filename":"script.exs",
          "template":`IO.puts "hello, world"`
        },
        {
          "id": 58,
          "name": "Erlang (OTP 22.2)",
          "filename":"main.erl",
          "template":`main(_) ->
  io:fwrite("hello, world \\n").
      `
        },
        {
          "id": 44,
          "name": "Executable",
          "filename":"a.out",
          "template":`Judge0 IDE assumes that content of executable is Base64 encoded.

This means that you should Base64 encode content of your binary,
paste it here and click "Run".

Here is an example of compiled "hello, world" NASM program.
Content of compiled binary is Base64 encoded and used as source code.

https://ide.judge0.com/?kS_f
          `
        },
        {
          "id": 59,
          "name": "Fortran (GFortran 9.2.0)",
          "filename":"main.f90",
          "template":`program main
print *, "hello, world"
end
`
        },
        {
          "id": 60,
          "name": "Go (1.13.5)",
          "filename":"main.go",
          "template":`package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
          `
        },
        {
          "id": 61,
          "name": "Haskell (GHC 8.8.1)",
          "filename":"main.hs",
          "template":`main = putStrLn "hello, world"`
        },
        {
          "id": 62,
          "name": "Java (OpenJDK 13.0.1)",
          "filename":"Main.java",
          "template":`public class Main {
public static void main(String[] args) {
  System.out.println("hello, world");
  }
}`
        },
        {
          "id": 63,
          "name": "JavaScript (Node.js 12.14.0)",
          "filename":"script.js",
          "template":`console.log("hello, world");`
        },
        {
          "id": 64,
          "name": "Lua (5.3.5)",
          "filename":"script.lua",
          "template":`print("hello, world")`
        },
        {
          "id": 65,
          "name": "OCaml (4.09.0)",
          "filename":"main.ml",
          "template":`print_endline "hello, world"`
        },
        {
          "id": 66,
          "name": "Octave (5.1.0)",
          "filename":"script.m",
          "template":`printf("hello, world\n");`
        },
        {
          "id": 67,
          "name": "Pascal (FPC 3.0.4)",
          "filename":"main.pas",
          "template":`program Hello;
          begin
              writeln ('hello, world')
          end.
          `
        },
        {
          "id": 68,
          "name": "PHP (7.4.1)",
          "filename":"script.php",
          "template":`<?php
          print("hello, world\n");
          ?>`
        },
        {
          "id": 43,
          "name": "Plain Text",
          "filename":"text.txt",
          "template":`hello, world`
        },
        {
          "id": 69,
          "name": "Prolog (GNU Prolog 1.4.5)",
          "filename":"main.pro",
          "template":`:- initialization(main).
          main :- write('hello, world\n').
          `
        },
        {
          "id": 70,
          "name": "Python (2.7.17)",
          "filename":"script.py",
          "template":`print("hello, world")`
        },
        {
          "id": 71,
          "name": "Python (3.8.1)",
          "filename":"script.py",
          "template":`print("hello, world")`
        },
        {
          "id": 72,
          "name": "Ruby (2.7.0)",
          "filename":"script.rb",
          "template":`puts "hello, world"`
        },
        {
          "id": 73,
          "name": "Rust (1.40.0)",
          "filename":"main.rs",
          "template":`fn main() {
            println!("hello, world");
        }`
        },
        {
          "id": 74,
          "name": "TypeScript (3.7.4)",
          "filename":"script.ts",
          "template":`console.log("hello, world");`
        }
      ];

     
    const [codeRoom, setcodeRoom] = useState("Code room")
    const [Oproom, setOproom] = useState("output room")
    const [Iproom, setIproom] = useState("input room")

    const [Codetext, setCodeText] = useState(
      languages.find(x => x.id == 50).template
    )
    const [Iptext, setIpText] = useState('')
    const [Optext, setOpText] = useState('')
    const [codetitle, setTitle] = useState('')

    useEffect(()=>{
        socket.emit('room', { room: codeRoom});
        socket.emit('room', { room: Oproom});
        socket.emit('room', { room: Iproom });

        socket.on('code sent from server', payload => {
          updateCodeFromSockets(payload);
        });
    })

    const updateCodeFromSockets = (payload) =>{
      console.log('inside',payload);
      switch(payload.room){
        case codeRoom: 
          console.log(payload.newCode)
          setCodeText(payload.newCode)
        break;
        case Oproom: 
          console.log(payload.newCode)
          setOpText(payload.newCode)
        break;
        case Iproom: 
          console.log(payload.newCode)
          setIpText(payload.newCode)
        break;
      }
    }

    const updateCodeText = (value) => {
        console.log(value)
        setCodeText(value);
        socket.emit('coding', {
          room: codeRoom,
          newCode: value
        });
        // socket.emit('coding', {
        //   room: "room example",
        //   Code: e.target.value,
        //   output: 
        // });
      }

   

      const updateIpText = (value) => {
        setIpText(value);
        socket.emit('coding', {
          room: Iproom,
          newCode: value
        });
      }

      
const createsubmisssion = (source_code,languageid,stdin) => {
  var encodedsourcecode = btoa(source_code);
  var encodedstdin = btoa(stdin);
  var data = JSON.stringify({
    "source_code": encodedsourcecode,
    "language_id": languageid,
    "stdin": encodedstdin
  });
  
  var config = {
    method: 'post',
    url: 'https://ce.judge0.com/submissions/?base64_encoded=true&wait=true',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data)); 
    localStorage.setItem('token',response.data.token)
    getsubmission(response.data.token);
  })
  .catch(function (error) {
    console.log(error);
  });
}



const getsubmission = (token) => {
  // let mytoken=localStorage.getItem('token')
  
  var config = {
    method: 'get',
    url: `https://ce.judge0.com/submissions/${token}?base64_encoded=true`,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    if(response.data.status.description == 'Accepted'){
      if(response.data.stdout){
        var decodedOutput = atob(response.data.stdout);
      }
      else if(response.data.stderr){
        var decodedOutput=atob(response.data.stderr);
      }
      else if(response.data.compile_output){
        var decodedOutput=atob(response.data.compile_output);
      }
      setOpText(decodedOutput)
      socket.emit('coding', {
        room: Oproom,
        newCode: decodedOutput
      })

  }
  else{
    var decodedOutput = response.data.status.description
    setOpText(decodedOutput)
      socket.emit('coding', {
        room: Oproom,
        newCode: decodedOutput
      })
  }
})
  .catch(function (error) {
    console.log(error);
  });
}
const handleChange = (e) => {
  console.log("language Selected!!");
  console.log(e.target.value)
  setCodeText(languages.find(x => x.id == e.target.value).template)
  setlanguage(e.target.value);
}


const handleMenu = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};

const saveCode = (codeText,codetitle, language) => {
  var encodedsourcecode = btoa(codeText);
    var mycodes = {
        "codetext": encodedsourcecode,
        "languageid": language,
        "codetitle": codetitle
      };
      // console.log(id)
      var config = {  
          method:'post',
          url:'http://localhost:5000/code',
            data: mycodes,
            headers: {
                'userid': localStorage.userid
            }
      }
      
    axios(config)
}

    return (
      
        <div className="codingPlat">
          
          <AppBar className="bar" position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                <CodeIcon className="titleIcon"/>
                CodeColab
              </Typography>
              {auth && (
                <div>
              <ThemeProvider theme={darkTheme}>
              <FormControl variant="filled" className={classes.formControl}>
                <Select
                  className={classes.selectEmpty}
                  value={language}
                  onChange={(e)=>handleChange(e)}
                  inputProps={{
                    name: 'language',
                    id: 'filled-age-native-simple',
                  }}
                >
                    {languages.map((option) => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                </Select>    
                </FormControl>  
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={ () => createsubmisssion(Codetext, language, Iptext)}
                  className="buttonr"
                  startIcon={<PlayArrowIcon />}
                >
                  Run
                </Button>
                {/* saving code in db */}
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={ () =>{ const codetitle = prompt('Enter the code title:');
                  saveCode(Codetext,codetitle, language)
                  }}
                  className="buttonr"
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  // onClick={ () => createsubmisssion(Codetext, language, Iptext)}
                  className="buttonr"
                  startIcon={<CloudDownloadIcon />}
                >
                <DownloadLink
                  label="Download"
                  filename={languages.find(x => x.id == language).filename}
                  exportFile={() => Codetext}
                > 
                </DownloadLink>

                </Button>             
      
               
                  <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                      className="iconButton"
                    >
                      <AccountCircle className="butIcon" />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={handleClose}
                    >
                   <Link className="link" to='/Profile'>
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                    </Link>
                      <MenuItem onClick={logout}>logout</MenuItem>

                    </Menu>
                  </ThemeProvider>
                </div>
                
              )}
            </Toolbar>
          </AppBar>          
           <div className="coding row no-gutters">
            <div className="code col-6">
            <div className="header">
                    <h5 className="file">{languages.find(x => x.id == language).filename}</h5>
            </div>
              <CodeMirror
                id="code"
                value={Codetext}
              
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true,
                  indent: true,
                  smartIndent: true,
                  extraKeys: {
                    "Tab": "autocomplete"
                  },
                  spellcheck: true,
                  // matchTags: true,
                  autocorrect: true, 
                  keyMap: 'sublime',
                  autoCloseBrackets: true,
                  matchBrackets: true,
                  showHint:true,
                }}
                onBeforeChange={(editor, data, value) => {
                  console.log(editor);
                  console.log("value is",value);
                  updateCodeText(value)
                }}
              />
            </div>
            <div className="col-6">
              <div className="row">
                <div className="iptext col-12">
                  <div className="header">
                    <h5 className="file">Input</h5>
                  </div>

                <CodeMirror
                  id="iptext"
                  value={Iptext}
                  options={{
                    mode: 'javascript',
                    theme: 'dracula',
                    lineNumbers: true,
                    indent: true,
                    smartIndent: true,
                    spellcheck: true,
                    autocorrect: true, 
                  }}
                  onBeforeChange={(editor, data, value) => {
                    updateIpText(value)
                  }}
                />
                </div>
                <div className="optext col-12">
                <div className="header">
                    <h5 className="file">Output</h5>
                </div>
                <CodeMirror
                id="optext"
                options={{
                  mode: 'javascript',
                  theme: 'dracula',
                  lineNumbers: true,
                  indent: true,
                  smartIndent: true,
                  spellcheck: true,
                  autocorrect: true, 
                }}
                  value={Optext}
                />
                </div>
              </div>
            </div>
           </div>
        </div>
    )
}

TextEditor.propTypes = {
  logout: propTypes.func.isRequired
}

// const mapStateToProps = {
  
// }
export default connect(null, {logout})(TextEditor)

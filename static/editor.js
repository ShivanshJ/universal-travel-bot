

function Editor (div,wrapper) {
  var _this=this;
  this.HTMLheaders=['H1','H2','H3','H4','H5','H6'];
  this.focusmodeon=false;
  this.mainarea=div;
  this.wrapper=wrapper;
  this.focuselement=null;
  this.editor_tooltip=raceme.by('id:editor_tooltip');
  this.documentsaved=true;
  this.documentlocalsaved=true;
  this.seleccionPrevia=null;
  this.savedRange=null;
  this.inputenablecheck=true;
  
  
    if (this.editor_tooltip===null) {
        this.editor_tooltip=new Grape('div','html').id('editor_tooltip').addClass('editor_tooltip');
        new Grape('div','html').id('ulup').addTo(this.editor_tooltip);
        this.tooltipul=new Grape('ul','html').id('editor_tooltipul');
        var bth1=new Grape('a','html').attr('href','#').id('bth1').addChild(new Grape('img','html').attr('src','img/h1.png'));
        bth1.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('formatBlock','H1');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(bth1).addTo(this.tooltipul);
        var bth2=new Grape('a','html').attr('href','#').id('bth2').addChild(new Grape('img','html').attr('src','img/h2.png'));
        bth2.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('formatBlock','H2'); _this.showtooltip(e);}});
        new Grape('li','html').addChild(bth2).addTo(this.tooltipul);
        var bth3=new Grape('a','html').attr('href','#').id('bth3').addChild(new Grape('img','html').attr('src','img/h3.png'));
        bth3.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('formatBlock','H3');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(bth3).addTo(this.tooltipul);
        var btb=new Grape('a','html').attr('href','#').id('btb').addChild(new Grape('img','html').attr('src','img/b.png'));
        btb.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('bold');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(btb).addTo(this.tooltipul);
        var bti=new Grape('a','html').attr('href','#').id('bti').addChild(new Grape('img','html').attr('src','img/i.png'));
        bti.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('italic');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(bti).addTo(this.tooltipul);
        var btlink=new Grape('a','html').attr('href','#').id('btlink').addChild(new Grape('img','html').attr('src','img/link.png'));
        btlink.click(function (e) {
          if (!this.containsClass('btdisabled')) {
            e.stopPropagation();
            _this.seleccionPrevia = window.getSelection().getRangeAt(0);
             var enlaces=_this.getLinksInSelection();
             if (enlaces.length>0) {
                by('id:linkboxinput').value(enlaces[0].getAttribute('href'));
             } else {
                if (window.getSelection() && window.getSelection().toString() && window.getSelection().toString().trim().indexOf(' ')==-1 && ValidURL(window.getSelection().toString().trim())) {
                    by('id:linkboxinput').value(window.getSelection().toString().trim());
                  } else {
                    by('id:linkboxinput').value('Enter URL');
                }
             }
              _this.tooltipul.hide();
              by('id:linkbox').show();
              by('id:linkboxinput').focus();
            }
                 
        });
        new Grape('li','html').addChild(btlink).addTo(this.tooltipul);
        var btcc=new Grape('a','html').attr('href','#').id('btcc').addChild(new Grape('img','html').attr('src','img/cc.png'));
        btcc.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('formatBlock','BLOCKQUOTE');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(btcc).addTo(this.tooltipul);
        var btul=new Grape('a','html').attr('href','#').id('btul').addChild(new Grape('img','html').attr('src','img/ul.png'));
        btul.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('insertUnorderedList');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(btul).addTo(this.tooltipul);
        var btol=new Grape('a','html').attr('href','#').id('btol').addChild(new Grape('img','html').attr('src','img/ol.png'));
        btol.click(function (e) {if (!this.containsClass('btdisabled')) {e.stopPropagation(); _this.applyStyle('insertOrderedList');  _this.showtooltip(e);}});
        new Grape('li','html').addChild(btol).addTo(this.tooltipul);
       
      
        this.editor_tooltip.addChild(this.tooltipul);
        var linkbox=new Grape('div','html').id('linkbox');
        var linkboxinput=new Grape('input','html').attr('spellcheck','false').attr('type','text').attr('value','').id('linkboxinput').addTo(linkbox);
      
        linkboxinput.mouseup(function (e) {e.preventDefault();});
        linkboxinput.focus(function (e) {
            if (this.value()!='Enter URL' && this.value()!='') {
              this.seed.select();
            } else {
              this.seed.setSelectionRange(0,0);
            }       
        });
        linkboxinput.clic(function (e) {
          if (this.value()=='Enter URL') {
            this.seed.setSelectionRange(0,0);
          }
        },'cliclinkboxinput',false);
        linkboxinput.keydown(function (e) {
          if (this.value()=='Enter URL') this.value('');
        });
        linkboxinput.keypress(function (e) {
            if (e.keyCode=='13') {
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(_this.seleccionPrevia);
                document.execCommand('unlink',false);
                
                if (this.value().replace(/^\s+|\s+$/g, '')!='' && this.value()!='Enter URL') {
                  var url=this.value().trim();
                  if (!url.match("^(http://|https://|mailto:)") && url.substring(0,1)!='#') url = "http://" + url;
                  document.execCommand('createLink',false,url);
                  
                
                }
                window.getSelection().removeAllRanges();
                
                _this.hideTooltip();
                _this.tooltipul.show();
                by('id:linkbox').hide();
                this.value('');
                _this.restoreSelection();
                
                
            }
        });
        
        this.editor_tooltip.addChild(linkbox);
        new Grape('div','html').id('uldown').addTo(this.editor_tooltip);
        this.hideTooltip();
        by('body').item(0).addChild(this.editor_tooltip);
        
    }
  
  
    
  
  
    this.mainarea.mousedown(function (e) {
      if (e.button && e.button!=0) return false; // Para que no pase cuando se presiona el boton derecho o central
        _this.hideTooltip();
       //_this.unfocusmode();
        });
    this.mainarea.paste(function () { _this.documentsaved=false; _this.documentlocalsaved=false; _this.hideTooltip(); _this.removeStyles(); _this.removeNBSP(); _this.marginImgs(); _this.interactionImgs(); make_links_openable(); trytoautosave();});
    
  
  this.mainarea.keypress(function (e) {
  
     if (typeof e.charCode!=='undefined') {
        _this.lastCharCode=String.fromCharCode(e.charCode);
     }  else {
         _this.lastCharCode=null;
     }
      
  
      if(e.keyCode == '13' && e.shiftKey==false) {
          var parents=_this.getParents().block;
          var padre=window.getSelection().getRangeAt(0).commonAncestorContainer;
          if (padre.nodeType!=1) padre=padre.parentNode;
          document.execCommand('defaultParagraphSeparator', false, 'p'); 
          
        this.documentsaved=false;
        this.documentlocalsaved=false;
          
         setTimeout(function () {
           var padre=_this.getParents().block;
            var pr;
            if (padre.tagName=='BLOCKQUOTE') {
            
              document.execCommand('formatBlock',false,'P');
              document.execCommand('outdent');
              document.execCommand('formatBlock',false,'P');
              /*
              pr=_this.getParents().block;
              
              
              if (pr.previousSibling && pr.previousSibling.nodeType==1 && pr.previousSibling.tagName=='BLOCKQUOTE' && pr.previousSibling.innerHTML=='') {
                  //new Grape(pr.previousSibling).remove();
              }
              */
              
            } 
            trytoautosave(); 
            },0);
             
          
       } 
  
      
      
          
          
     
        
      
    });
        
   
    this.mainarea.keydown(function (e) {
      _this.lastCharCode=null;
      if (preferencesobj['prtypesound']=='pron' && !e.ctrlKey) {
        
            var randomPlay=function (min,max) {
              return Math.random() * (max - min) + min;
            }
            if(e.keyCode == 34 ) {
              mp3_return_new.pause();
              mp3_scrollDown.pause();
              mp3_scrollDown.currentTime=0;
              mp3_scrollDown.playbackRate=randomPlay(0.85,1);
              mp3_scrollDown.play();
            }
            else if(e.keyCode == 33 ){
              mp3_return_new.pause();
              mp3_scrollUp.pause();
              mp3_scrollUp.currentTime=0;
              mp3_scrollUp.playbackRate=randomPlay(0.85,1);
              mp3_scrollUp.play();
            }
            else if(e.keyCode == 8 || e.keyCode==46){
              mp3_return_new.pause();
              mp3_backspace.pause();
              mp3_backspace.currentTime=0;
              mp3_backspace.playbackRate=randomPlay(0.97,1.03);
              mp3_backspace.play();
            }
            else if(e.keyCode == 32 ){
              mp3_return_new.pause();
              mp3_space.pause();
              mp3_space.currentTime=0;
              mp3_space.playbackRate=randomPlay(0.95,1.05);
              mp3_space.play();
            }
            else if(e.keyCode == 13 ){
              mp3_return_new.pause();
              mp3_return_new.currentTime=0;
              mp3_return_new.volume=0.7;
              mp3_return_new.playbackRate=randomPlay(0.99,1.01);
              mp3_return_new.play();
            }
            else if ((e.keyCode>=48 && e.keyCode<=90) || (e.keyCode>=96 && e.keyCode<=111) || (e.keyCode>=187)) {
              if (mp3_whatsound[parseInt(e.keyCode)]) {
                mp3_return_new.pause();
                
                var whatsound=mp3_whatsound[parseInt(e.keyCode)]; 
                whatsound.pause();
                whatsound.currentTime=0;
                whatsound.playbackRate=randomPlay(0.98,1.01);
                whatsound.volume=randomPlay(0.5,0.7);
                whatsound.play();  
              }
            }
      }
  
  
        
   
         if ((e.keyCode===32 && !e.metaKey && !e.ctrlKey) || e.keyCode==13) {
          if (e.keyCode==32) e.preventDefault();
          _this.lastCharCode=' ';
          var txtin=window.getSelection().anchorNode['data'];
          var txtpos=window.getSelection().anchorOffset;
          var padres=_this.getParents();
          var padre=padres.block;
          if (window.getSelection().anchorNode.parentNode.tagName=='LI') padre=window.getSelection().anchorNode.parentNode;
          var lastchar;
          if (txtin) lastchar=txtin.slice(Math.max(txtpos-1,0),txtpos);
          if (e.keyCode==32) {
            if (e.shiftKey && preferencesobj['przerowidthnonjoiner']=='pron') {
              document.execCommand('insertText',false,String.fromCharCode(8204));
            } else if (lastchar==' ') {
               document.execCommand('insertText',false,String.fromCharCode(160));
               
            } else {
              document.execCommand('insertText',false,' ');
             
            }  
          }
          
      txtin=window.getSelection().anchorNode['data'];
          txtpos=window.getSelection().anchorOffset;
          
          if (e.keyCode==13 && !e.shiftKey && padre.tagName=='P' && txtin && txtin.trim().length>2 && txtin.trim().split('-').join('')=='') {
                  for (var r=0; r<txtin.length;r++) document.execCommand('delete');
                  
                  
                document.execCommand('formatBlock',false,'P');
                document.execCommand('insertHorizontalRule'); 
                document.execCommand('formatBlock',false,'P');
  
                  
                  return false;
  
          } else if (preferencesobj['prautocapitalization']=='pron' && lastchar!=' ') {
                
                if (!txtin || !padre) return false;
                      var untilInitofP=false;
                      if (padre.textContent==txtin) {
                        untilInitofP=true;
                      } else if (window.getSelection().anchorNode.previousSibling && ((window.getSelection().anchorNode.previousSibling.nodeType==1 && window.getSelection().anchorNode.previousSibling.tagName=='BR') || window.getSelection().anchorNode.nodeType==3)) {
                        untilInitofP=true;  
                      } 
                     
                      
                 
                      var autocapitalize=true;
                      if (txtin.length>1 || (e.keyCode==13 && txtin.length>0)) {
                        var f;
                        f=txtpos-2;
                        if (e.keyCode==13) f=txtpos-1;
                        for (f; f>=0; f--) {
                         
                          var current_char=txtin.slice(f,f+1);
                   
                          if (current_char==' ' || current_char=='¡' || current_char=='¿' || current_char==String.fromCharCode(160) || current_char==String.fromCharCode(8195) || current_char==String.fromCharCode(8194) || current_char=='\n') {
  
                            
                            if (f==txtpos-2) {
                              autocapitalize=false; 
                            } else if (current_char=='\n') {
                              autocapitalize=true;
                            } else if ((f>0 && (txtin.slice(f-1,f)=='.' || txtin.slice(f-1,f)=='!' || txtin.slice(f-1,f)=='?')) || (f==0 && untilInitofP)) {
                              autocapitalize=true; 
                            } else {
                              autocapitalize=false; 
                            }
                            f++;
                            break;
                          } else if (current_char==String.fromCharCode(8230) || current_char==String.fromCharCode(8211) || current_char==String.fromCharCode(8212)) {
                            
                            autocapitalize=false; break;
                          } else if (current_char=='.') {
                             if ((f==txtpos-1 && e.keyCode==13) || f==txtpos-2) continue;
                            autocapitalize=true;
                            f++;
                            break;
                          } else if (current_char!=current_char.toLowerCase() && f==0) {
                          
                            autocapitalize=false; break;
                          } else if (f==0) {
                           
                            if (untilInitofP==false) autocapitalize=false;
                            break;
                          }
                        }
                  
                        if (autocapitalize) {
  
                          var strtoIntroduce=txtin.slice(f,txtpos);
                          strtoIntroduce=strtoIntroduce.replace(strtoIntroduce.substring(0,1),strtoIntroduce.substring(0,1).toUpperCase());
                      
                          if (strtoIntroduce.length>0 && strtoIntroduce!=txtin.slice(f,txtpos)) {
                            
                             
                            for (var t=0;t<strtoIntroduce.length;t++) document.execCommand('delete');
  
                            document.execCommand('insertText',false,strtoIntroduce);
                            
                            trytoautosave();
                          }
                            
                        } else {
                          trytoautosave();
                        }
                        
                      }
  
                } 
  
  
          if (e.keyCode==32) return false;
          } 
        
    
       keydownkeyup(e);
      
     
       
       if (e.metaKey && (e.keyCode==109 || e.keyCode==189 || e.keyCode==45 || e.keyCode==54)) {
        _this.enableZoomOut();
      } else if (e.metaKey && e.keyCode==107) {
        _this.disableZoomOut();
      } else if (e.ctrlKey && e.altKey==false) {
        //if (e.ctrlKey || e.metaKey) {
         if (e.keyCode==109 || e.keyCode==189 || e.keyCode==45 || e.keyCode==54) {
          e.preventDefault();
          _this.enableZoomOut();
         } else if (e.keyCode==107 && e.shiftKey==false) {
          e.preventDefault();
          _this.disableZoomOut();
         } else if (e.keyCode=='79' || e.keyCode=='111') {
            e.preventDefault();
            e.cancelBubble = true;
            _showmenus();
            raceme.by('id:opopen').click();
            return false;
         } else if (e.keyCode=='115' || e.keyCode=='83') {
            e.preventDefault();
            e.cancelBubble = true;
            _this.saveSelection();
            _showmenus();
            raceme.by('id:opsave').click();
           return false
         } else if (e.keyCode=='66') {
            e.preventDefault();
            e.cancelBubble = true;
            raceme.by('id:btb').click();
            return false;
         } else if (e.keyCode=='73') {
            e.preventDefault();
            e.cancelBubble = true;
            raceme.by('id:bti').click();
            return false;
         } else if (e.keyCode=='85') {
            e.preventDefault();
            e.cancelBubble = true;
            if (by('id:alert_window')==null) code_window();
            return false;
         } else if (e.keyCode===80) {
            by('id:opprint').clic();
          } else if (e.ctrlKey && (e.keyCode==88 || e.keyCode==90)) {
            editor.documentsaved=false;
            editor.documentlocalsaved=false;
            
            trytoautosave();
          } 
       } else {
        if (e.keyCode!=122 && e.keyCode!=9 && (e.keyCode<33 || e.keyCode>40) && e.keyCode!=16 && e.keyCode!=17) hidemenus(e);
        if (e.keyCode==33 || e.keyCode==34) wrapper.removeClass('disablescroll');
        if (e.keyCode=='9' && e.altKey==false && e.metaKey==false) {
          
          e.preventDefault();
          //document.execCommand('insertHTML',false,'&emsp;');
          document.execCommand('insertText',false,String.fromCharCode(0x2003));
          trytoautosave();
          _this.focusmode(); 
          _this.hideTooltip();
          return false;
      
        } 
        
       }
    });
  
   this.mainarea.keyup(function (e) {
     
          
  
  
      keydownkeyup(e);
    });
    
    var keydownkeyup=function(e) {
       //if (_this.getSelectionY()>window.innerHeight-150 && _this.getSelectionY()-(window.innerHeight-149)>5) {
        //if (_this.getSelectionY()>window.innerHeight-300 && _this.getSelectionY()-(window.innerHeight-299)>5) {
          if (_this.getSelectionY()>window.innerHeight-main_padding_bottom && _this.getSelectionY()-(window.innerHeight-main_padding_bottom+1)>5) {
              if (scrollanimation) scrollanimation.stop();
              
              //scrollanimation=wrapper.animate(50).ease('out').scrollTop(wrapper.scrollTop()+(_this.getSelectionY()-(window.innerHeight-149)));
              //scrollanimation=wrapper.animate(50).ease('out').scrollTop(wrapper.scrollTop()+(_this.getSelectionY()-(window.innerHeight-299)));
              scrollanimation=wrapper.animate(200).ease('out').scrollTop(wrapper.scrollTop()+(_this.getSelectionY()-(window.innerHeight-main_padding_bottom+1)));
              
  
          }  else if ((e.keyCode==38 || e.keyCode==33 || e.keyCode==36) && wrapper.scrollTop()+_this.getSelectionY()<150) {
             if (scrollanimation) scrollanimation.stop();
             scrollanimation=wrapper.animate(50).ease('out').scrollTop(0);
          }
  
        if (menuopen) {
          if (e.keyCode!=17 && e.keyCode!=91 && e.keyCode!=93) {
            if (!((e.ctrlKey || e.metaKey) && (e.keyCode==79 || e.keyCode==111))) calmlylogo.clic();  
          }
        }
      
    
        if (e.keyCode=='13') {
              while(by('id:blockfocus')!==null) {
              raceme.by('id:blockfocus').stop().attr('id',null).style('color',null);
              }
             
              //var eli=_this.getParents().block;
               //_this.removeStyles(eli.seed);
             
        
              _this.focusmode(); 
              _this.hideTooltip();
              
               
          } else  if (e.keyCode===8 || e.keyCode===46) {
            setTimeout(function () {
              if (window.getSelection().anchorNode && window.getSelection().anchorNode.nodeType==3 && window.getSelection().anchorNode.parentNode.id=='main') {
                          document.execCommand('formatBlock',false,'P');
                        }
              /*
              
              
              if (elm.id=='main') {
                document.execCommand('formatBlock',false,'P');;
                elm=_this.getParents().block;
              }
              */ 
              var elm=_this.getParents().block;
              //_this.removeStyles(elm.seed);
              
             
              
              trytoautosave();
              _this.focusmode(); 
              _this.hideTooltip();
            });
            
            
            
      }  else {
          _this.focusmode(); 
          _this.showtooltip(e);
      }
           _this.saveSelection(); 
    }
    
  
    
    this.mainarea.click(function (e) {
     hide_tooltip_links_openable();
     var sel=window.getSelection();
      
      if (!e.shiftKey && sel.getRangeAt(0) && _this.savedRange  && sel.getRangeAt(0).startContainer==_this.savedRange.startContainer && sel.getRangeAt(0).endContainer==_this.savedRange.endContainer && sel.getRangeAt(0).startOffset==_this.savedRange.startOffset && sel.getRangeAt(0).endOffset==_this.savedRange.endOffset) {
      _this.restoreSelection();
      _this.saveSelection();
      _this.hideTooltip();
      } else {
      _this.saveSelection();
      
     
      }
      if (menuopen) calmlylogo.clic(); 
    },'mclic',false);
    
     
    this.mainarea.input(function (e) {
    
      
        callwordcounter();
        
        
        _this.disableZoomOut();
        _this.documentsaved=false;
        _this.documentlocalsaved=false;
        
        setTimeout(function () {
        if (window.getSelection().anchorNode.nodeType==3 && window.getSelection().anchorNode.parentNode.id=='main') {
                document.execCommand('formatBlock',false,'P');
              } else if (window.getSelection().anchorNode.nodeType==1 && window.getSelection().anchorNode.id=='main') { 
                document.execCommand('formatBlock',false,'P');
              }
        });
        
  
        _this.saveSelection();
        var txtin=window.getSelection().anchorNode['data'];
        var txtpos=window.getSelection().anchorOffset;
        var padre=_this.getParents().block;
  
        
        if (typeof txtin!=='undefined' && _this.inputenablecheck==true) {
            
               var prevmarkpos;
               var contentmark;
              var j;
             
              var lastchar=txtin.slice(Math.max(txtpos-1,0),txtpos);
              var last2chars=txtin.slice(Math.max(txtpos-2,0),txtpos);
              var last3chars=txtin.slice(Math.max(txtpos-3,0),txtpos);
               
              if (lastchar===String.fromCharCode(0x0022) && _this.lastCharCode=='"') {
              
               if (preferencesobj['prsmartquotes']=='pron') {
                    var firstdbl=String.fromCharCode(0x201c);
                    var seconddbl=String.fromCharCode(0x201d);
                    //var htmlcharfirst='&ldquo;';
                    //var htmlcharsecond='&rdquo;';
                    if (useruilanguage) {
                      if (useruilanguage=='de') {
                          //htmlcharfirst='&bdquo;';
                          //htmlcharsecond='&ldquo;';
                         firstdbl=String.fromCharCode(0x201e);
                         seconddbl=String.fromCharCode(0x201c);
                      } else if (useruilanguage=='pl') {
                          //htmlcharfirst='&bdquo;';
                          //htmlcharsecond='&rdquo;';
                         firstdbl=String.fromCharCode(0x201e);
                         seconddbl=String.fromCharCode(0x201d);
                      } else if (useruilanguage=='fi' || useruilanguage=='sv') {
                          //htmlcharfirst='&rdquo;';
                          //htmlcharsecond='&rdquo;';
                         firstdbl=String.fromCharCode(0x201d);
                         seconddbl=String.fromCharCode(0x201d);
                      }  
                    }
                    
                    var htmlchar=firstdbl;
                    var nod=window.getSelection().anchorNode;
                    var addtxt;
                    while (nod) {
                       if (nod.previousSibling) {
                        nod=nod.previousSibling;
                            if (nod.nodeType==3) {
                              addtxt=nod.nodeValue;
                              txtpos+=addtxt.length;
                              txtin=addtxt+txtin;
                           } else if (nod.nodeType==1) {
                              addtxt=new Grape(nod).text();
                              txtpos+=addtxt.length;
                              txtin=addtxt+txtin;
                           }
                       } else if (nod.parentNode) {
                        nod=nod.parentNode;
                        if (nod==padre || nod.tagName=='LI' || nod.tagName=='TD') break;
                       } else {
                       break;
                       }
                       
                       
                    
                    }
                    
                  
                    
                    for (j=txtpos-1; j>=0;j--) {
                       if (txtin.slice(j,j+1)==firstdbl) {
                       //htmlchar=htmlcharsecond; break;
                       htmlchar=seconddbl; break;
                       } else if (txtin.slice(j,j+1)==seconddbl) {
                       break;
                       }
                    }
                    _this.inputenablecheck=false;
                    document.execCommand('delete');
                    document.execCommand('insertText',false,htmlchar);
                    _this.inputenablecheck=true;
                    trytoautosave();
                  }
                  
              
              } else if (lastchar==='\'' && _this.lastCharCode=="'" && preferencesobj['prsmartquotes']=='pron') {
             
                  
                  if (txtpos==1 || txtin.slice(txtpos-2,txtpos-1)==' ' || txtin.slice(txtpos-2,txtpos-1)==String.fromCharCode(160)) {
                    document.execCommand('delete');
                    if (useruilanguage && (useruilanguage=='de' || useruilanguage=='pl')) {
                    document.execCommand('insertText',false,'‚');
                    } else if (useruilanguage && (useruilanguage=='fi' || useruilanguage=='sv')) {
                    document.execCommand('insertText',false,'’');
                    } else {
                      document.execCommand('insertText',false,'‘');
                    }
                  } else {
                    document.execCommand('delete');
                  if (useruilanguage && useruilanguage=='de') {
                  document.execCommand('insertText',false,'‘');
                  } else {
                    // El polaco, finlandes y sueco también es rsquo
                    document.execCommand('insertText',false,'’');
                  }
                  
                    
                  }
                  trytoautosave();
                
              
              
              } else if (last2chars=='<<' && _this.lastCharCode=='<' && preferencesobj['prsmartquotes']=='pron') {
                _this.inputenablecheck=false;
                document.execCommand('delete');
                document.execCommand('delete');
                document.execCommand('insertText',false,'«');
                _this.inputenablecheck=true;
                trytoautosave();
  
              }  else if (last2chars=='>>' && _this.lastCharCode=='>' && preferencesobj['prsmartquotes']=='pron') {
                _this.inputenablecheck=false;
                document.execCommand('delete');
                document.execCommand('delete');
                document.execCommand('insertText',false,'»');
                _this.inputenablecheck=true;
                trytoautosave();
  
              } else if (last2chars===String.fromCharCode(0x2014)+'-' && _this.lastCharCode=='-') {
                  _this.inputenablecheck=false;
                  for (j=0; j<2; j++) document.execCommand('delete');
                  document.execCommand('insertText',false,'----');
                  _this.inputenablecheck=true;
                  trytoautosave();
              
              } else if (last2chars==='--' && last3chars!=='---' && _this.lastCharCode=='-') {
                  if (preferencesobj['prsmartdash']=='pron') {
                    _this.inputenablecheck=false;
                    for (j=0; j<2; j++) document.execCommand('delete');
                    
                     //document.execCommand('insertHTML',false,'&ndash;');
                   document.execCommand('insertText',false,'–');
                    
                    _this.inputenablecheck=true;
                    trytoautosave();
                  }
                  
              } else if (last2chars===String.fromCharCode(0x2013)+'-' && _this.lastCharCode=='-') {
                if (preferencesobj['prsmartdash']=='pron') {
                    _this.inputenablecheck=false;
                    for (j=0; j<2; j++) document.execCommand('delete');
                     
                     //document.execCommand('insertHTML',false,'&mdash;');
                   document.execCommand('insertText',false,'—');
                     
                    _this.inputenablecheck=true;
                    trytoautosave();
                  }
              } else if (last3chars==='...' && _this.lastCharCode=='.') { 
                 if (preferencesobj['prsmartellipses']=='pron') {
                    _this.inputenablecheck=false;
                   for (j=0; j<3; j++) document.execCommand('delete'); 
                   
                   //document.execCommand('insertHTML',false,'&#8230;');
                  document.execCommand('insertText',false,'…');
  
                   _this.inputenablecheck=true;
                   trytoautosave();
                   }
                  
    
             
              } else if (last3chars==='***' && padre && padre.tagName!='PRE' && _this.lastCharCode=='*') {
                prevmarkpos=txtin.slice(0,txtpos-3).lastIndexOf('***');
                if (prevmarkpos!=-1) {
                  contentmark=txtin.slice(prevmarkpos+3,txtpos-3);
                  if (contentmark.length>0) {
                      for (j=0; j<(contentmark.length+6); j++) document.execCommand('delete'); 
                     document.execCommand('bold');  document.execCommand('italic');
                     document.execCommand('insertText',false,contentmark);
                     document.execCommand('italic'); document.execCommand('bold');
                     document.execCommand('insertText',false,' ');
                    trytoautosave();
                  }
                }
                
              } else if (last2chars==='**' && padre && padre.tagName!='PRE'  && _this.lastCharCode=='*') {
                var prevtriple=txtin.slice(0,txtpos-2).lastIndexOf('***');
                var prevdoble=txtin.slice(0,txtpos-2).lastIndexOf('**');
                if (prevdoble!=-1 && (prevtriple==-1 || prevtriple!=prevdoble-1)) {
                  contentmark=txtin.slice(prevdoble+2,txtpos-2);
                  if (contentmark.length>0) {
                      for (j=0; j<(contentmark.length+4); j++) document.execCommand('delete'); 
                     document.execCommand('bold'); 
                     document.execCommand('insertText',false,contentmark);
                     document.execCommand('bold');
                     document.execCommand('insertText',false,' ');
                    trytoautosave();
                  }
                }
                
              } else if (lastchar==='*' && padre && padre.tagName!='PRE' && _this.lastCharCode=='*') {
                  var prevdouble=txtin.slice(0,txtpos-1).lastIndexOf('**');
                  var prevsingle=txtin.slice(0,txtpos-1).lastIndexOf('*');
                  if (prevsingle!=-1 && (prevdouble==-1 || prevdouble!=prevsingle-1)) {
                  contentmark=txtin.slice(prevsingle+1,txtpos-1);
                  if (contentmark.length>0) {
                    for (j=0; j<(contentmark.length+2); j++) document.execCommand('delete'); 
                    document.execCommand('italic');
                    document.execCommand('insertText',false,contentmark);
                    document.execCommand('italic');
                    document.execCommand('insertText',false,' ');
                    trytoautosave();
                  }
                  
                  }
              } else if (lastchar===')' && _this.lastCharCode==')') {
                  
                 var prevp=txtin.slice(0,txtpos-1).lastIndexOf('(');
                 if (prevp>0) {
                    
                    if (txtin.substring(prevp-1,prevp)==']') {
                       
                       var prevcor=txtin.slice(0,prevp-2).lastIndexOf('[');
                       if (prevcor!=-1) {
                          var phref=txtin.slice(prevp+1,txtpos-1);
                          var plink=txtin.slice(prevcor+1,prevp-1);
                          
                          for (j=0; j<(phref.length+plink.length+4); j++) document.execCommand('delete');
                          if (!phref.match("^(http://|https://|mailto:)") && phref.substring(0,1)!='#') phref = "http://" + phref;
                          document.execCommand('insertHTML',false,'<a href="'+phref+'">'+plink+'</a>');
                          document.execCommand('insertText',false,' ');
                          
                          
                       }
                    }
                 }
                 trytoautosave();  
              
              } else if (lastchar && _this.lastCharCode!=null && lastchar!='#' && _this.lastCharCode!='#' && (txtin=='#'+lastchar || txtin=='##'+lastchar || txtin=='###'+lastchar) && padre && padre.tagName=='P') {
                setTimeout(function () {
                  for (var i=0; i<txtin.length; i++) document.execCommand('delete');
                  if (txtin=='#'+lastchar) {
                    _this.applyStyle('formatBlock','H1');
                  } else if (txtin=='##'+lastchar) {
                    _this.applyStyle('formatBlock','H2');
                  } else {
                    _this.applyStyle('formatBlock','H3');
                  }
                  document.execCommand('insertHTML',false,lastchar);
                  trytoautosave();  
                });
  
              } else if ((lastchar==' ' || lastchar==String.fromCharCode(160)) && (_this.lastCharCode==' ' || _this.lastCharCode==String.fromCharCode(160)) && (txtin=='* ' || txtin=='*'+String.fromCharCode(160)) && preferencesobj['prasterisk'] && preferencesobj['prasterisk']=='pron' && padre && padre.tagName=='P') {
                setTimeout(function () {
                document.execCommand('delete');
                document.execCommand('delete');
                _this.applyStyle('insertUnorderedList'); 
                 trytoautosave();  
                });
              } else if (last2chars=='1.' && _this.lastCharCode=='.' && txtin=='1.' && preferencesobj['prnumbered'] && preferencesobj['prnumbered']=='pron' && padre && padre.tagName=='P') {
                setTimeout(function () {
                document.execCommand('delete');
                document.execCommand('delete');
                _this.applyStyle('insertOrderedList'); 
                 trytoautosave();  
                });
              } else if (lastchar=='>' && _this.lastCharCode=='>' && txtin=='>' && padre && padre.tagName=='P') {
                setTimeout(function () {
                
                _this.applyStyle('formatBlock','BLOCKQUOTE');
                document.execCommand('delete');
                 trytoautosave();  
                });
              } else {
                  
                  trytoautosave();  
              }
          
          } 
        
        
        }
        );
        
      
    }
  Editor.fn=Editor.prototype;
  
  Editor.fn.focusmode=function () {
     if (this.focusmodeon) {
        this.focuselement=null;
        var theparents=this.getParents();
        for (var i=0; i<theparents.spans.length;i++) {
            if (theparents.spans[i].tagName=='LI') {
                this.focuselement=new Grape(theparents.spans[i]);
                break;
            }
        }   
        if (this.focuselement===null) this.focuselement=new Grape(this.getParents().block);
      
        if (this.focuselement.id()!='main') {
           if (this.focuselement.id()!='blockfocus') {
           
                while(raceme.by('id:blockfocus')!==null) {
                  raceme.by('id:blockfocus').stop().attr('id',null).style('color',null);
                }
               
                this.focuselement.by('span').attr('style',null);
                
                this.focuselement.id('blockfocus');
                this.mainarea.addClass('focusmodeon');
                
                
            }
      } else {
        /*this.unfocusmode();*/
      }
       }  
        
  }
  Editor.fn.unfocusmode=function (forced) {
        if (this.focusmodeon || forced) {
          while(raceme.by('id:blockfocus')!==null) {raceme.by('id:blockfocus').attr('id',null);}
          this.mainarea.removeClass('focusmodeon');
        }
  }
  
  Editor.fn.showtooltip=function (e) {
    var selection=window.getSelection();
      if (e.shiftKey && selection.toString()!='') this.disableZoomOut();
      hide_tooltip_links_openable(); 
      callwordcounter();
      if (typeof e==='undefined') return;
      if (preferencesobj['prtoolbar'] && preferencesobj['prtoolbar']=='proff') return;
      e.stopPropagation(); 
      var parents=this.getParents();          
      
      if (selection.toString()!='') {
                         
        
        this.tooltipul.show();
        raceme.by('id:linkbox').hide();
         var range = selection.getRangeAt(0);
        
        
        
        by('id:editor_tooltipul').by('a').style('background-color',null).removeClass("btdisabled");
      
        
        
        if (parents.block!=null) {
  
  
          
           if (this.HTMLheaders.indexOf(parents.block.tagName)!=-1 || parents.intersectHeader) {
              by('id:btb').addClass("btdisabled");
              by('id:bti').addClass("btdisabled");
              by('id:btul').addClass("btdisabled");
              by('id:btol').addClass("btdisabled");
  
            } 
           if (parents.block.tagName=='DIV' && parents.block.id=='main') {
            by('id:bth1').addClass("btdisabled");
            by('id:bth2').addClass("btdisabled");
            by('id:bth3').addClass("btdisabled");
  
           }
           if (parents.block.tagName=='OL' || parents.block.tagName=='LI' || parents.block.tagName=='UL') {
              by('id:bth1').addClass("btdisabled");
              by('id:bth2').addClass("btdisabled");
              by('id:bth3').addClass("btdisabled");
           
           }
           if (parents.block.tagName=='PRE' || parents.intersectPre || parents.intersectHR) {
              by('id:btul').addClass("btdisabled");
              by('id:btol').addClass("btdisabled");
              
           } 
            
          
          if (parents.block.tagName=='H1') {by('id:bth1').style('background-color','rgb(0,179,114)');} 
          if (parents.block.tagName=='H2') {by('id:bth2').style('background-color','rgb(0,179,114)');} 
          if (parents.block.tagName=='H3') {by('id:bth3').style('background-color','rgb(0,179,114)');}
          if (parents.block.tagName=='BLOCKQUOTE') {raceme.by('id:btcc').style('background-color','rgb(0,179,114)');}
          if (parents.block.tagName=='UL') {by('id:btul').style('background-color','rgb(0,179,114)');}
          if (parents.block.tagName=='OL') {by('id:btol').style('background-color','rgb(0,179,114)');}
          
        }
        if (parents.spans.length>0) {
          for (var h=0; h<parents.spans.length; h++) {
              if (parents.spans[h].tagName=='B') {
               raceme.by('id:btb').style('background-color','rgb(0,179,114)'); 
              } else if (parents.spans[h].tagName=='I') {
               raceme.by('id:bti').style('background-color','rgb(0,179,114)');
              } else if (parents.spans[h].tagName=='A') {
              raceme.by('id:btlink').style('background-color','rgb(0,179,114)');
              
              }
          }
        }
        
        
        
        
         var boxes=range.getClientRects();
         var minx;
         var miny1;
         var miny2;
         var maxx;
         var maxy1;
         var maxy2;
         
         if (boxes.length>0) {
       
           minx=boxes[0].left;
           miny1=boxes[0].top;
           miny2=boxes[0].bottom;
  
           maxx=boxes[boxes.length-1].right;
           maxy1=boxes[boxes.length-1].top;
           maxy2=boxes[boxes.length-1].bottom;
         }
         var posicionx=e.pageX;
         var posiciony=e.pageY;
         
         if (dist(e.pageX,e.pageY,minx,miny1)<dist(e.pageX,e.pageY,maxx,maxy1)) {
          posicionx=minx;
          posiciony=miny1;  
         } else {
         
          posicionx=maxx;
          posiciony=maxy1;
         }
      
         
           var time_animacion=0;
           if (this.editor_tooltip.style('display')=='none') time_animacion=250;
           
            this.editor_tooltip.stop();
            var ancho_tool=300;
            if (posiciony-20>50) {
            by('id:ulup').hide();
            by('id:uldown').show().style('left','50%');
           
            
           
            this.editor_tooltip.style('display','inline').style('opacity',0);
           if (time_animacion>0) {
            this.editor_tooltip.style('top',(posiciony-58)+'px').style('left',(posicionx-(ancho_tool/2))+'px');
            this.editor_tooltip.animate(time_animacion).ease('out').style('top','+=8px');
             this.editor_tooltip.animate(time_animacion).ease('out').style('opacity',1);
            } else {
              //this.editor_tooltip.stop().animate(100).ease('inout').style('top',(posiciony-50)+'px').style('left',(posicionx-(ancho_tool/2))+'px');
              this.editor_tooltip.style('top',(posiciony-50)+'px').style('left',(posicionx-(ancho_tool/2))+'px');
              this.editor_tooltip.style('opacity',1);
  
            }
            } else {
            if (posiciony==maxy1) posiciony=maxy2;
            if (posiciony==miny1) posiciony=miny2;
            by('id:ulup').show().style('left','50%');
            by('id:uldown').hide();
            
            this.editor_tooltip.style('display','inline');
            this.editor_tooltip.style('opacity','0');
            if (time_animacion>0) {
              this.editor_tooltip.style('top',(posiciony+12)+'px').style('left',(posicionx-(ancho_tool/2))+'px');
              this.editor_tooltip.animate(time_animacion).ease('out').style('top','-=6px');
              this.editor_tooltip.animate(time_animacion).ease('out').style('opacity',1);
            } else {
              this.editor_tooltip.style('top',(posiciony+6)+'px').style('left',(posicionx-(ancho_tool/2))+'px');
              this.editor_tooltip.style('opacity',1);
            }
            
            }
          
            var cambio_pos;
            if (posicionx-(ancho_tool/2)<10) {
              
                cambio_pos=10-(posicionx-ancho_tool/2);
                this.editor_tooltip.style('left','10px');
                by('id:ulup').style('margin-left',((ancho_tool/2)-cambio_pos-8)+'px'); by('id:uldown').style('margin-left',((ancho_tool/2)-cambio_pos-8)+'px');
            } else if (posicionx+(ancho_tool/2)>window.innerWidth-10) {
           
                cambio_pos=(posicionx+ancho_tool/2)-window.innerWidth+10;
                 this.editor_tooltip.style('left',(window.innerWidth-10-ancho_tool)+'px');
                 by('id:ulup').style('margin-left',((ancho_tool/2)+cambio_pos-8)+'px'); by('id:uldown').style('margin-left',((ancho_tool/2)+cambio_pos-8)+'px');
            } else {
           
            by('id:ulup').style('margin-left','141px'); by('id:uldown').style('margin-left','141px');
            }
          
          
          
        
        
      } else {
      
        if (e.target.tagName!='INPUT') {
            this.hideTooltip();
        }
      
      }
  
  
  }
  
  
  Editor.fn.applyStyle=function (name, args) {
  
  if (window.getSelection().rangeCount==0) {return;}
  this.documentsaved=false;
  this.documentlocalsaved=false;
  
  var padre;
  padre=this.getParents();
   
  if (name=='formatBlock') {
  
    if (args=='BLOCKQUOTE' && (padre.block.tagName=='OL' || padre.block.tagName=='LI' || padre.block.tagName=='UL')) { document.execCommand('outdent'); return this.applyStyle(name,args);}
    if (args=='BLOCKQUOTE' && padre.block.tagName!=args && padre.block.parentNode.tagName==args) {document.execCommand('outdent'); this.marginImgs(); this.interactionImgs(); return false; }
    
    if (padre.block.tagName=='DIV' && padre.block.id=='main' && (args=='H1' || args=='H2' || args=='H3' || args=='<H1>' || args=='<H2>' || args=='<H3>')) return false;
    if (padre.block.tagName==args || '<'+padre.block.tagName+'>'==args) {
          if (args=='P' || args=='BLOCKQUOTE') document.execCommand('outdent');
          args='P';
        } 
    if (padre.block.tagName=='UL' || padre.block.tagName=='OL' || padre.block.tagName=='LI') return false;
    if (padre.block.tagName=='BLOCKQUOTE' && padre.block.parentNode && padre.block.parentNode.tagName=='BLOCKQUOTE') {document.execCommand('outdent'); return this.applyStyle(name,args);}
    if (padre.block.tagName=='P' && padre.block.parentNode.tagName=='BLOCKQUOTE') {document.execCommand('outdent'); this.marginImgs(); this.interactionImgs(); return false;}
    if (args=='H1' || args=='H2' || args=='H3' || args=='<H1>' || args=='<H2>' || args=='<H3>') document.execCommand('removeFormat');
   
  
  } else if (name=='bold' || name=='italic') {
  
   
    if (this.HTMLheaders.indexOf(padre.block.tagName)!=-1 || padre.intersectHeader) return false;
    
  } else if (name=='insertUnorderedList' || name=='insertOrderedList') {
    
    if (padre.intersectPre==true || padre.block.tagName=='PRE' || padre.intersectHR==true) return false;
    if (padre.block.tagName=='BLOCKQUOTE') {document.execCommand('outdent'); return this.applyStyle(name,args);}
    if (this.HTMLheaders.indexOf(padre.block.tagName)!=-1) {document.execCommand('formatBlock',false,'p');  this.marginImgs(); this.interactionImgs(); return false;  }
    
    if (name=='insertUnorderedList') {
        if (padre.block.tagName=='UL' || (padre.block.tagName=='LI' && padre.block.parentNode.tagName=='UL')) {document.execCommand('outdent'); document.execCommand('formatBlock',false,'p'); this.marginImgs(); this.interactionImgs(); return false;}
    } else if (name=='insertOrderedList') {
        if (padre.block.tagName=='OL' || (padre.block.tagName=='LI' && padre.block.parentNode.tagName=='OL'))  {document.execCommand('outdent'); document.execCommand('formatBlock',false,'p'); this.marginImgs(); this.interactionImgs(); return false;}    
    }
    
    if (padre.block.tagName=='P') {
      var con=replaceAll(padre.block.outerHTML,' id="blockfocus"','');
      con=replaceAll(con,'<p>','<li>');
      con=replaceAll(con,'<P>','<li>');
      con=replaceAll(con,'</p>','</li>');
      con=replaceAll(con,'</P>','</li>');
      
      if (name=='insertUnorderedList') {
        document.execCommand('insertHTML',false,'<ul>'+con+'</ul>');new Grape(padre.block).remove(); return;
      } else if (name=='insertOrderedList') {
        document.execCommand('insertHTML',false,'<ol>'+con+'</ol>');new Grape(padre.block).remove(); return;
      }
    }
  
  } 
  
  
    
    
    var returnvalue=document.execCommand(name,false,args);
  
    
    
    
    this.marginImgs(); this.interactionImgs();  
   this.removeStyles();
    
    
  trytoautosave();  
    
  }
  
  Editor.fn.getParents=function () {
  var parents={};
  parents.block=null;
  parents.spans=[];
  parents.intersectHeader=false;
  parents.intersectPre=false;
  parents.intersectHR=false;
  var _selection=window.getSelection(); 
  if (_selection.rangeCount==0) return parents;
  var _range=_selection.getRangeAt(0);
  
  var contenidos=_range.cloneContents();
  for (var h=0; h<this.HTMLheaders.length;h++) {
    if (contenidos.querySelector(this.HTMLheaders[h])!=null) {parents.intersectHeader=true; break;}
  }
  if (contenidos.querySelector('PRE')!=null) parents.intersectPre=true;
  if (contenidos.querySelector('HR')!=null) parents.intersectHR=true;
   
  var primario;
  if (_range.endContainer.nodeType==1 && _range.endOffset==0) {
  primario=_range.startContainer;
  } else {
  primario=_selection.getRangeAt(0).commonAncestorContainer;
  }
  
  
  
  if (primario==null) return parents;
  
  if (primario.nodeType!=1) primario=primario.parentNode;
  
      while (primario.tagName!='BLOCKQUOTE' && primario.tagName!='P' && this.HTMLheaders.indexOf(primario.tagName)==-1 && primario.tagName!='DIV' && primario.tagName!='UL' && primario.tagName!='OL' && primario.tagName!='TD' && primario.tagName!='PRE') {
      parents.spans.push(primario);
      if (primario.parentNode==null) break;
      primario=primario.parentNode;
      }
      
      if (primario.tagName=='P' && primario.parentNode.tagName=='BLOCKQUOTE') {
          // FF
          parents.spans.push(primario);
          primario=primario.parentNode;
      }
      parents.block=primario;
  
      
      
  
      return parents;
  
  
  }
  
  
  function eliminar_etiqueta(elm) {
    var hij=elm.seed.firstChild;
    while (hij) {
              elm.seed.parentNode.insertBefore(hij,elm.seed);
              hij = elm.seed.firstChild;
            }
          elm.remove();
  }
  
  function cambiar_etiqueta(elm,etiqueta) {
    var nueva=new Grape(etiqueta,'html');
    elm.seed.parentNode.insertBefore(nueva.seed,elm.seed);
    var hij=elm.seed.firstChild;
    while (hij) {
              nueva.seed.appendChild(hij);
              hij = elm.seed.firstChild;
            }
    elm.remove();
  }
  
  Editor.fn.removeNBSP=function (elm) {
    var _this=this;
    if (typeof elm==='undefined') elm=this.mainarea;
     for (var j=0; j<elm.seed.childNodes.length; j++) {
      if (elm.seed.childNodes[j].nodeType==3) {
        var str=elm.seed.childNodes[j].nodeValue;
        
        if (str.substring(0,1)==String.fromCharCode(160)) {
         
          str=' '+str.substring(1);
          elm.seed.childNodes[j].nodeValue=str;
        }
        if (str.slice(-1)==String.fromCharCode(160)) {
            
          str=str.substring(0,str.length-1)+' ';
          elm.seed.childNodes[j].nodeValue=str;
        }
        
        
      }
    }
    
     elm.getChildren().each(function () {
        _this.removeNBSP(this);
     });
    
  
  }
  
  Editor.fn.cleanStyleAttribute=function (elm) {
    var styles=elm.attr('style');
    var directionStyle="";
    if (styles) {
      styles=styles.split(";");
      for (var i=0;i<styles.length;i++) {
        var currentStyle=styles[i];
        currentStyle=currentStyle.split(":");
        if (currentStyle.length==2) {
          var styleName=currentStyle[0].trim().toLowerCase();
          var styleValue=currentStyle[1].trim().toLowerCase();
          if (styleName=='direction' && (styleValue=='rtl' || styleValue=='ltr')) {
              directionStyle=styleValue;
          } 
        }
      }
    }
    if (directionStyle=="") {
      elm.style(null);
    } else {
      elm.attr("style","direction:"+directionStyle);
    }
  }
  Editor.fn.removeStyles=function (elm) {
  
    var _this=this;
    if (typeof elm==='undefined') elm=this.mainarea;
    elm.seed.normalize();
   
    
    elm.getChildren().each(function () {
    
        if (this.tagName()=='INPUT' || this.tagName()=='TEXTAREA' || this.tagName()=='SELECT' || this.tagName()=='BUTTON' || this.tagName()=='SCRIPT' || this.tagName()=='SVG' || this.tagName()=='FRAME' || this.tagName()=='IFRAME' || this.tagName()=='EMBED') {
          this.remove();      
        }  else if (this.tagName()=='MARK' || this.tagName()=='FONT'  || (this.tagName()=='P' && this.getParent() && (this.getParent().tagName()=='LI' || this.getParent().tagName()=='TD' || this.getParent().tagName()=='P' || _this.HTMLheaders.indexOf(this.getParent().tagName())!=-1))) {
          _this.removeStyles(this);
          eliminar_etiqueta(this);
        } else if ((this.tagName()=='P' || this.tagName()=='BLOCKQUOTE') && this.getParent() && (this.getParent().tagName()=='P' || this.getParent().tagName()=='BLOCKQUOTE')) {
          _this.removeStyles(this);
          eliminar_etiqueta(this);
        } else if (this.tagName()=='BLOCKQUOTE'  && isEmptyContent(this)) { 
          this.remove();
        } else {
        this.attr('align',null).attr('face',null).attr('color',null).attr('bgcolor',null).attr('size',null).attr('lang',null).attr('border',null).attr('color',null).attr('width',null).attr('height',null).attr('valign',null).attr('vspace',null).attr('id',null).attr('class',null).attr('name',null);
        
        try {
          var attributes_to_remove=[];
          for (var iss = 0; iss < this.seed.attributes.length; iss++) {
              var attrib = this.seed.attributes[iss];
              if (attrib.name.toLowerCase().startsWith('on') || attrib.value.toLowerCase().startsWith('javascript:')) attributes_to_remove.push(attrib.name);
          }
          for (var iss=0;iss<attributes_to_remove.length;iss++) {
            this.attr(attributes_to_remove[iss],null);
          }
        } catch (e) {
          console.log(e);
        }
  
        if (this.tagName()=='IMG') {
            
            var mrgl=this.style('margin-left');
            var wd=this.style('width');
            this.style(null);
            this.style('margin-left',mrgl).style('width',wd);
            
           
            } else {
            _this.cleanStyleAttribute(this);
            //this.style(null);
              if (this.tagName()=='DIV' && this.id()!='main') {
                  if (this.getParent() && this.getParent().id=='main') {
                   _this.removeStyles(this);
                  cambiar_etiqueta(this,'P');
                 
                  } else {
                  _this.removeStyles(this);
                  eliminar_etiqueta(this);
                  
                  }
              
              } else if (this.tagName()=='STRONG') {
                _this.removeStyles(this);
                cambiar_etiqueta(this,'b');
              } else if (this.tagName()=='EM') {
                _this.removeStyles(this);
                cambiar_etiqueta(this,'i');
              } else {
                _this.removeStyles(this);      
              }
            } 
        
        
        
        
        
        }
      });
    
   if (elm==this.mainarea) {
      
      var chil=this.mainarea.seed.childNodes;
      for (var i=0; i<chil.length;i++) {
        var nuevop;
        var viejo;
        var hij;
        if (chil[i].nodeType==3 && chil[i].nodeValue.trim()!='') {
          var ch=chil[i];
          nuevop=new Grape('p','html');
          this.mainarea.seed.insertBefore(nuevop.seed,ch);
          nuevop.seed.appendChild(ch);
          
        
        }
      }
      
  }
  elm.seed.normalize();
   
    
  }
  
  
  Editor.fn.saveSelection=function ()
  {     
      
      
      if (window.getSelection && window.getSelection().rangeCount>0) {
       this.savedRange = window.getSelection().getRangeAt(0);
       
       
      }
      
      
      
  }
  
  
  Editor.fn.restoreSelection=function ()
  {     
      
      if (this.savedRange != null) {
          if (window.getSelection) 
          {
          
               
              var s = window.getSelection();
              
              this.savedRange.setStart(this.savedRange.endContainer,this.savedRange.endOffset);
              this.savedRange.setEnd(this.savedRange.endContainer,this.savedRange.endOffset);
              
              if (s.rangeCount > 0) s.removeAllRanges();
              
              s.addRange(this.savedRange);
                
                 
          }
         
      }
      
  }
  
  
  
  
  Editor.fn.enableZoomOut=function () {
  
    var zratio=0.33;
    var _this=this;
    if (!mainarea.containsClass('zoomout')) {
  
      mainarea.addClass('zoomout');
      if (scrollanimation) scrollanimation.stop();
      
      mainarea.animate(250).ease('inout').meanwhile(function (momento,pos) {
        this.style('transform','scale('+raceme.map(pos,0,1,1,zratio)+')');
      }).opacity(1);
      var hh=parseInt(wrapper.style('height').replace('px',''));
      scrollanimation=wrapper.animate(250).ease('inout').scrollTop(wrapper.scrollTop()*zratio-200);
     
    }
  }
  Editor.fn.disableZoomOut=function (e) {
    var zratio=0.33;
    if (e) {
      var ww=parseInt(wrapper.style('width').replace('px',''));
      if (e.clientX>ww-14) return;
    }
    if (mainarea.containsClass('zoomout')) {
        if (scrollanimation) scrollanimation.stop();
        mainarea.animate(250).ease('inout').meanwhile(function (momento,pos) {
          this.style('transform','scale('+raceme.map(pos,0,1,zratio,1)+')');
        }).opacity(1).done(function () {this.removeClass('zoomout').style('transform','scale(1)')});
        var hh=parseInt(wrapper.style('height').replace('px',''));
        if (e) {
          scrollanimation=wrapper.animate(250).ease('inout').scrollTop((wrapper.scrollTop()/zratio)+(e.clientY/zratio)-hh/2);
        } else {
          scrollanimation=wrapper.animate(250).ease('inout').scrollTop((wrapper.scrollTop()/zratio));
        }
       
    }
  }
  
  
  Editor.fn.marginImgs=function () {
   
  
    var imgs=this.mainarea.by('img');
    var _this=this;
    imgs.each(function () {
     
     var _thisimg=this;
      _this.ajustarImg(_thisimg);
      _thisimg.seed.onload=function () {_this.ajustarImg(_thisimg);} 
      
  });
  
  }
  
  Editor.fn.ajustarImg=function (gpr) {
  
   
    var ancho_screen=this.wrapper.seed.clientWidth;
    var ancho_main=this.mainarea.seed.clientWidth;
    gpr.style('width',null);
    gpr.style('margin-left',null);
    gpr.style('margin-right',null);
    gpr.style('max-width',null);
      var ancho_img=gpr.seed.clientWidth;
     
    if (gpr.getParent().id()=='main' || ((gpr.getParent().tagName()=='P' || this.HTMLheaders.indexOf(gpr.getParent().tagName()!=-1)) && (gpr.getParent().getParent() && gpr.getParent().getParent().id()=='main'))) { 
       if (ancho_img>ancho_screen) {
         
            gpr.style('width',ancho_screen+'px').style('margin-left','-'+(((ancho_screen-ancho_main)/2)+25)+'px');
        } else if (ancho_img>ancho_main) {
            gpr.style('margin-left','-'+(((ancho_img-ancho_main)/2)+25)+'px').style('width',ancho_img);
        } else {
            gpr.style('margin-left','auto');
           
        }
    } else {
        gpr.style('max-width','100%');
    }
  
  
  }
  
  
  
  Editor.fn.interactionImgs=function () {
  
  var imgs=this.mainarea.by('img');
  imgs.removeEvent();
  var _this=this;
  imgs.clic(function (e) {
   
    var range = document.createRange();
    range.selectNodeContents(this.seed);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    _this.hideTooltip();
    
  });
  
  
  }
  
  
  Editor.fn.getLinksInSelection=function () {
      var selectedLinks = [];
      var range, containerEl, links, linkRange;
      
          sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
              linkRange = document.createRange();
              for (var r = 0; r < sel.rangeCount; ++r) {
                  range = sel.getRangeAt(r);
                  containerEl = range.commonAncestorContainer;
                  if (containerEl.nodeType != 1) {
                      containerEl = containerEl.parentNode;
                  }
                  if (containerEl.nodeName.toLowerCase() == "a") {
                      selectedLinks.push(containerEl);
                  } else {
                      links = containerEl.getElementsByTagName("a");
                      for (var i = 0; i < links.length; ++i) {
                          linkRange.selectNodeContents(links[i]);
                          if (linkRange.compareBoundaryPoints(range.END_TO_START, range) < 1 && linkRange.compareBoundaryPoints(range.START_TO_END, range) > -1) {
                              selectedLinks.push(links[i]);
                          }
                      }
                  }
              }
              //linkRange.detach();
          }
       
      return selectedLinks;
  }
  
  
  Editor.fn.hideTooltip=function () {this.editor_tooltip.style('display','none');callwordcounter();}
  
  
  Editor.fn.htmlCode=function (includeimages) {
  var html='';
   this.mainarea.seed.normalize();
  for (var i=0; i<this.mainarea.seed.childNodes.length; i++) {
      html+=this.elementCode(this.mainarea.seed.childNodes[i],0,includeimages);
  }
  
  return html;
  
  }
  Editor.fn.elementCode=function (nodo,nivel,includeimages) {
  var htmlelement='';
  if (typeof nivel==='undefined') nivel=0;
  if (nodo.nodeType==3) {
    if (nodo.nodeValue.trim()!='') {
      //return nodo.nodeValue.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {return '&#'+i.charCodeAt(0)+';';});
      return he.encode(nodo.nodeValue,{'useNamedReferences': true}).split('&#x9;').join('').split('\n').join('<br/>');
      } else {
      return ' ';
      }
    } 
  if (nodo.nodeType==1) {
      var name=nodo.tagName;
      if (name=='I') name='EM';
      if (name=='B') name='STRONG';
     
      
      if (nodo.childNodes.length==0) {
        
        if ((name=='HR' || name=='IMG') && nivel==0) {
          htmlelement+='\n';
        }
      
        if (name!='SPAN' && name!='O:P' && name!='IMG' && name!='BR') htmlelement+=(new XMLSerializer()).serializeToString(nodo).split(' xmlns="http://www.w3.org/1999/xhtml"').join('');
        
        if (name=='BR') {
          if (nivel>0) htmlelement+='<br />';
        }
        if (name=='IMG') {
            
            if (nodo.getAttribute('src').substring(0,5)!="data:" && includeimages) {
              htmlelement+="<img src='"+getBase64Image(nodo)+"' ";
            } else {
              htmlelement+="<img src='"+nodo.getAttribute('src')+"' ";
  
            }
            if (nodo.getAttribute('alt')!=null) htmlelement+="alt='"+nodo.getAttribute('alt')+"' ";
            htmlelement+="/>";
            
            }
       
        if ((name=='HR' || name=='IMG') && nivel==0) {
          htmlelement+='\n';
        }
      } else {
        var newline=false;
        if (name=='P' || name=='BLOCKQUOTE' || name=='UL' || name=='OL' || name=='LI' || this.HTMLheaders.indexOf(name)!=-1 || name=='DIV' || name=='TR' || name=='TABLE' || name=='TD' || name=='THEAD' || name=='TBODY' || name=='TH') newline=true;
        if (name!='SPAN' && name!='O:P') {
          if (newline) {
            htmlelement+='\n';
            if (nivel>0) htmlelement+=Array(nivel).join('\t');
            } 
          htmlelement+='<'+name.toLowerCase();
          for (var att = 0; att < nodo.attributes.length; att++) {
            var atti = nodo.attributes[att];
            if (atti.name!='xmlns') htmlelement+=" "+atti.name+"='"+atti.value+"'";
          }
          htmlelement+='>';
        }
        for (var i=0; i<nodo.childNodes.length;i++) {
          htmlelement+=this.elementCode(nodo.childNodes[i],nivel+1,includeimages);
        }  
        newline=false;
        if (name=='UL' || name=='OL' || name=='DIV'  || name=='TR' || name=='TABLE' || name=='TD'  || name=='THEAD' || name=='TBODY' || name=='TH') newline=true;
        
        if (name!='SPAN' && name!='O:P') {
          if (newline) {
            htmlelement+='\n';
            if (nivel>0) htmlelement+=Array(nivel).join('\t');
            }
          
          htmlelement+='</'+name.toLowerCase() +'>';
        }
        
      }
  
  }
  return htmlelement;
  
  }
  
  Editor.fn.getSelectionY= function () {
      var sel = document.selection, range;
      var y = 0;
      if (sel) {
          if (sel.type != "Control") {
              range = sel.createRange();
              range.collapse(true);
              y = range.boundingTop;
          }
      } else if (window.getSelection) {
          sel = window.getSelection();
          
          if (sel.rangeCount) {
              range = sel.getRangeAt(0).cloneRange();
             
              if (range.getClientRects) {
               if (range.getClientRects().length>0) {
                  range.collapse(true);
                  var rect = range.getClientRects()[0];
                  if (rect) y = rect.top;
                } else {
                if (range.commonAncestorContainer.getBoundingClientRect) y=range.commonAncestorContainer.getBoundingClientRect().top;
                
                }
              }
          }
      }
      return y;
  }
  
  
  function dist(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
  }
  function getFirstNodeText(elm) {
    var frt=null;
    for (var i=0; i<elm.childNodes.length;i++) {
        if (elm.childNodes[i].nodeType==3) {
          return elm.childNodes[i];
        } else if (elm.childNodes[i].nodeType==1) {
          var secfrt=getFirstNodeText(elm.childNodes[i]);
          if (secfrt!=null) return secfrt;
        }
    }
    return frt;
  }
  function isEmptyContent(gpr) {
    if (gpr.text()=='' && gpr.by('img').length==0) return true;
    
    return false;
  }
  function deleteNCharacters(n) {
  // No se usa
                            var ran=window.getSelection().getRangeAt(0);
                            ran.collapse(false);
                            var rannode=ran.endContainer;
                            if (rannode.nodeType==3) {
                              var pos_end=ran.endOffset;
                              var pos_start=ran.endOffset-n;
                              var ran = document.createRange();
                              ran.setStart(rannode,pos_start);
                              ran.setEnd(rannode,pos_end);
                              
                              window.getSelection().removeAllRanges();
                              window.getSelection().addRange(ran);  
                              ran.deleteContents();
                              return true;
                            }
                            return false;
  }
  
  
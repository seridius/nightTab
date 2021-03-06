var link = (function() {

  var _bind = function(override) {
    var options = {
      element: null,
      action: null,
      bookmarkData: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    };
    var action = {
      edit: function() {
        options.element.addEventListener("click", function() {
          edit(options.bookmarkData);
        }, false);
      },
      remove: function() {
        options.element.addEventListener("click", function() {
          remove(options.bookmarkData);
          control.dependents();
          control.render();
        }, false);
      }
    };
    if (options.element != null) {
      action[options.action]();
    };
  };

  var edit = function(bookmarkData) {
    var currentBookmark = bookmarks.get(bookmarkData.timeStamp);
    var form = _makeLinkForm();
    form.querySelector(".link-form-input-letter").value = currentBookmark.letter;
    form.querySelector(".link-form-input-name").value = currentBookmark.name;
    form.querySelector(".link-form-input-url").value = currentBookmark.url;
    if (currentBookmark.accent.override) {
      form.querySelector(".link-form-input-color").value = helper.rgbToHex(currentBookmark.accent.color);
    } else {
      form.querySelector(".link-form-input-color").value = helper.rgbToHex(state.get().theme.accent.current);
    };
    modal.render({
      heading: "Edit " + currentBookmark.name,
      action: function() {
        save({
          action: "edit",
          form: form,
          bookmarkData: bookmarkData
        });
      },
      actionText: "Save",
      size: "small",
      content: form
    });
  };

  var add = function() {
    var form = _makeLinkForm();
    modal.render({
      heading: "Add a new bookmark",
      action: function() {
        save({
          action: "add",
          form: form
        });
        control.dependents();
        control.render();
      },
      actionText: "Add",
      size: "small",
      content: form
    });
  };

  var save = function(override) {
    var options = {
      action: null,
      form: null,
      bookmarkData: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    };
    var action = {
      add: function() {
        var newBookmarkData = {
          letter: options.form.querySelector(".link-form-input-letter").value,
          name: options.form.querySelector(".link-form-input-name").value,
          url: options.form.querySelector(".link-form-input-url").value,
          timeStamp: new Date().getTime(),
          accent: {
            override: false,
            color: {
              r: null,
              g: null,
              b: null
            }
          }
        };
        if (options.form.querySelector(".link-form-input-color").value != helper.rgbToHex(state.get().theme.accent.current)) {
          newBookmarkData.accent.override = true;
          newBookmarkData.accent.color = helper.hexToRgb(options.form.querySelector(".link-form-input-color").value);
        };
        bookmarks.add(newBookmarkData);
      },
      edit: function() {
        options.bookmarkData.letter = options.form.querySelector(".link-form-input-letter").value;
        options.bookmarkData.name = options.form.querySelector(".link-form-input-name").value;
        options.bookmarkData.url = options.form.querySelector(".link-form-input-url").value;
        if (options.form.querySelector(".link-form-input-color").value != helper.rgbToHex(state.get().theme.accent.current)) {
          options.bookmarkData.accent.override = true;
          options.bookmarkData.accent.color = helper.hexToRgb(options.form.querySelector(".link-form-input-color").value);
        } else {
          options.bookmarkData.accent.override = false;
          options.bookmarkData.accent.color = {
            r: null,
            g: null,
            b: null
          };
        };
        bookmarks.edit({
          bookmarkData: options.bookmarkData,
          timeStamp: options.bookmarkData.timeStamp
        });
      }
    };
    action[options.action]();
    data.save();
    clear();
    render();
  };

  var remove = function(bookmarkData) {
    bookmarks.remove(bookmarkData.timeStamp);
    _checkCount();
    data.save();
    clear();
    render();
  };

  var _checkCount = function() {
    if (bookmarks.get().length <= 0) {
      helper.setObject({
        object: state.get(),
        path: "bookmarks.edit",
        newValue: false
      });
    };
  };

  var _makeLinkForm = function() {
    var form = helper.makeNode({
      tag: "form",
      attr: [{
        key: "class",
        value: "link-form"
      }]
    });
    var fieldset = helper.makeNode({
      tag: "fieldset"
    });
    var letterLabel = helper.makeNode({
      tag: "label",
      text: "Letters",
      attr: [{
        key: "for",
        value: "letters"
      }]
    });
    var letterInput = helper.makeNode({
      tag: "input",
      attr: [{
        key: "type",
        value: "text"
      }, {
        key: "class",
        value: "link-form-input-letter"
      }, {
        key: "id",
        value: "letters"
      }, {
        key: "placeholder",
        value: "E"
      }, {
        key: "tabindex",
        value: "1"
      }, {
        key: "autocomplete",
        value: "off"
      }, {
        key: "autocorrect",
        value: "off"
      }, {
        key: "autocapitalize",
        value: "off"
      }, {
        key: "spellcheck",
        value: "false"
      }]
    });
    var nameLabel = helper.makeNode({
      tag: "label",
      text: "Name",
      attr: [{
        key: "for",
        value: "name"
      }]
    });
    var nameInput = helper.makeNode({
      tag: "input",
      attr: [{
        key: "type",
        value: "text"
      }, {
        key: "class",
        value: "link-form-input-name"
      }, {
        key: "id",
        value: "name"
      }, {
        key: "placeholder",
        value: "Example"
      }, {
        key: "tabindex",
        value: "1"
      }, {
        key: "autocomplete",
        value: "off"
      }, {
        key: "autocorrect",
        value: "off"
      }, {
        key: "autocapitalize",
        value: "off"
      }, {
        key: "spellcheck",
        value: "false"
      }]
    });
    var urlLabel = helper.makeNode({
      tag: "label",
      text: "URL",
      attr: [{
        key: "for",
        value: "url"
      }]
    });
    var urlInput = helper.makeNode({
      tag: "input",
      attr: [{
        key: "type",
        value: "text"
      }, {
        key: "class",
        value: "link-form-input-url"
      }, {
        key: "id",
        value: "url"
      }, {
        key: "placeholder",
        value: "https://www.example.com/"
      }, {
        key: "tabindex",
        value: "1"
      }, {
        key: "autocomplete",
        value: "off"
      }, {
        key: "autocorrect",
        value: "off"
      }, {
        key: "autocapitalize",
        value: "off"
      }, {
        key: "spellcheck",
        value: "false"
      }]
    });
    var colorInputWrap = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "input-wrap py-0"
      }]
    });
    var colorFormGroup = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "form-group"
      }]
    });
    var colorInputLabel = helper.makeNode({
      tag: "label",
      text: "Accent override",
      attr: [{
        key: "for",
        value: "color"
      }]
    });
    var colorInputInput = helper.makeNode({
      tag: "input",
      attr: [{
        key: "id",
        value: "color"
      }, {
        key: "class",
        value: "link-form-input-color mb-0"
      }, {
        key: "type",
        value: "color"
      }, {
        key: "value",
        value: helper.rgbToHex(state.get().theme.accent.current)
      }, {
        key: "tabindex",
        value: "1"
      }]
    });
    var colorButtonRefresh = helper.makeNode({
      tag: "button",
      attr: [{
        key: "class",
        value: "button mb-0"
      }, {
        key: "type",
        value: "button"
      }, {
        key: "tabindex",
        value: "1"
      }]
    });
    var colorButtonRefreshIcon = helper.makeNode({
      tag: "span",
      attr: [{
        key: "class",
        value: "icon-refresh"
      }]
    });
    var colorPara = helper.makeNode({
      tag: "p",
      text: "Use this color to override the global Accent colour.",
      attr: [{
        key: "class",
        value: "input-helper small muted"
      }]
    });
    colorButtonRefresh.addEventListener("click", function(event) {
      colorInputInput.value = helper.rgbToHex(state.get().theme.accent.current);
    }, false);
    fieldset.appendChild(letterLabel);
    fieldset.appendChild(letterInput);
    fieldset.appendChild(nameLabel);
    fieldset.appendChild(nameInput);
    fieldset.appendChild(urlLabel);
    fieldset.appendChild(urlInput);
    fieldset.appendChild(colorInputLabel);
    colorFormGroup.appendChild(colorInputInput);
    colorButtonRefresh.appendChild(colorButtonRefreshIcon);
    colorFormGroup.appendChild(colorButtonRefresh);
    colorInputWrap.appendChild(colorFormGroup);
    fieldset.appendChild(colorInputWrap);
    fieldset.appendChild(colorPara);
    form.appendChild(fieldset);
    return form;
  };

  var _makeLink = function(data) {
    var linkItemOptions = {
      tag: "div",
      attr: [{
        key: "class",
        value: "link-item"
      }]
    };
    if (data.accent.override) {
      linkItemOptions.attr.push({
        key: "style",
        value: "--accent: " + data.accent.color.r + ", " + data.accent.color.g + ", " + data.accent.color.b
      });
    };
    var linkItem = helper.makeNode(linkItemOptions);
    var linkPanelFrontOptions = {
      tag: "a",
      attr: [{
        key: "class",
        value: "link-panel-front"
      }, {
        key: "href",
        value: data.url
      }, {
        key: "tabindex",
        value: 1
      }]
    };
    if (state.get().bookmarks.newTab) {
      linkPanelFrontOptions.attr.push({
        key: "target",
        value: "_blank"
      });
    };
    var linkPanelFront = helper.makeNode(linkPanelFrontOptions);
    var linkPanelBack = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "link-panel-back"
      }]
    });
    var linkLetter = helper.makeNode({
      tag: "p",
      text: data.letter,
      attr: [{
        key: "class",
        value: "link-letter"
      }]
    });
    var linkName = helper.makeNode({
      tag: "p",
      text: data.name,
      attr: [{
        key: "class",
        value: "link-name"
      }]
    });
    var linkUrl = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "link-url"
      }]
    });
    var linkUrlText = helper.makeNode({
      tag: "p",
      text: data.url.replace(/^https?\:\/\//i, "").replace(/\/$/, ""),
      attr: [{
        key: "class",
        value: "link-url-text"
      }, {
        key: "title",
        value: data.url.replace(/^https?\:\/\//i, "").replace(/\/$/, "")
      }]
    });
    var linkControl = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "link-control"
      }]
    });
    var linkEdit = helper.makeNode({
      tag: "button",
      attr: [{
        key: "class",
        value: "button button-small link-control-item"
      }, {
        key: "tabindex",
        value: -1
      }]
    });
    var linkEditIcon = helper.makeNode({
      tag: "span",
      attr: [{
        key: "class",
        value: "button-icon icon-edit"
      }]
    });
    var linkRemove = helper.makeNode({
      tag: "button",
      attr: [{
        key: "class",
        value: "button button-small link-control-item"
      }, {
        key: "tabindex",
        value: -1
      }]
    });
    var linkRemoveIcon = helper.makeNode({
      tag: "span",
      attr: [{
        key: "class",
        value: "button-icon icon-close"
      }]
    });
    linkPanelFront.appendChild(linkLetter);
    linkPanelFront.appendChild(linkName);
    linkEdit.appendChild(linkEditIcon);
    linkRemove.appendChild(linkRemoveIcon);
    linkControl.appendChild(linkEdit);
    linkControl.appendChild(linkRemove);
    linkUrl.appendChild(linkUrlText);
    linkPanelBack.appendChild(linkUrl);
    linkPanelBack.appendChild(linkControl);
    linkItem.appendChild(linkPanelFront);
    linkItem.appendChild(linkPanelBack);
    _bind({
      element: linkEdit,
      action: "edit",
      bookmarkData: data
    });
    _bind({
      element: linkRemove,
      action: "remove",
      bookmarkData: data
    });
    return linkItem;
  };

  var _makeEmptySearch = function() {
    var searchInput = helper.e(".search-input");
    var div = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "link-empty"
      }]
    });
    var h1 = helper.makeNode({
      tag: "h1",
      attr: [{
        key: "class",
        value: "link-empty-heading"
      }],
      text: "No matching bookmarks found"
    });
    div.appendChild(h1);
    return div;
  };

  var _makeEmptyBookmarks = function() {
    var searchInput = helper.e(".search-input");
    var div = helper.makeNode({
      tag: "div",
      attr: [{
        key: "class",
        value: "link-empty"
      }]
    });
    var h1 = helper.makeNode({
      tag: "h1",
      attr: [{
        key: "class",
        value: "link-empty-heading"
      }],
      text: "No bookmarks added"
    });
    div.appendChild(h1);
    return div;
  };

  var render = function() {
    var linkArea = helper.e(".link-area");
    var bookmarksToRender = false;
    if (state.get().search) {
      bookmarksToRender = search.get();
    } else {
      bookmarksToRender = bookmarks.get();
    };
    var action = {
      render: {
        bookmarks: function(array) {
          array.forEach(function(arrayItem, index) {
            linkArea.appendChild(_makeLink(arrayItem));
          });
        },
        empty: {
          search: function() {
            linkArea.appendChild(_makeEmptySearch());
          },
          bookmarks: function() {
            linkArea.appendChild(_makeEmptyBookmarks());
          }
        }
      }
    };
    // if searching
    if (state.get().search) {
      // if bookmarks exist to be searched
      if (bookmarksToRender.total > 0) {
        // if matching bookmarks found
        if (bookmarksToRender.matching.length > 0) {
          action.render.bookmarks(bookmarksToRender.matching);
        } else {
          action.render.empty.search();
        };
      } else {
        action.render.empty.bookmarks();
      };
    } else {
      // if bookmarks exist
      if (bookmarksToRender.length > 0) {
        action.render.bookmarks(bookmarksToRender);
      } else {
        action.render.empty.bookmarks();
      };
    };
  };

  var tabIndex = function() {
    var allLinkControlItem = helper.eA(".link-control-item");
    if (state.get().bookmarks.edit) {
      allLinkControlItem.forEach(function(arrayItem, index) {
        arrayItem.tabIndex = 1;
      });
    } else {
      allLinkControlItem.forEach(function(arrayItem, index) {
        arrayItem.tabIndex = -1;
      });
    };
  };

  var clear = function() {
    var linkArea = helper.e(".link-area");
    while (linkArea.lastChild) {
      linkArea.removeChild(linkArea.lastChild);
    };
  };

  var init = function() {
    render();
  };

  // exposed methods
  return {
    init: init,
    clear: clear,
    add: add,
    edit: edit,
    save: save,
    remove: remove,
    render: render,
    tabIndex: tabIndex
  };

})();

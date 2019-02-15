;
(function($) {
    var mytree = function(elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };
    mytree.prototype = {
        defaults: {
            isexpand: false,
            data: [],
            onEdit: function() {},
            onFlow: function() {},
            onAct: function() {},
            onDel: function() {}
        },
        init: function() {
            this.config = $.extend({}, this.defaults, this.options);
            this.render();
            return this;
        },
        render: function() {
            var self = this;
            var str = '<div class="tree-con"><div class="tree"></div></div>';
            this.$elem.empty();
            this.$elem.append(str);
            var $tree = this.$elem.find('.tree');
            var stree = '<div class="tree-item">';
            var idx = 0; //children 阶层
            traverseTree(this.config.data);

            function traverseTree(node) {
                if (!node) {
                    return;
                }
                traverseNode(node);
                if (node.children && node.children.length > 0) {
                    idx += 1;
                    if (self.config.isexpand === true) {
                        stree += '<div class="tree-children" style="display:block;">';
                    } else {
                        stree += '<div class="tree-children" style="display:none;">';
                    }

                    for (var i = 0; i < node.children.length; i++) {

                        stree += '<div class="tree-item">';
                        traverseTree(node.children[i]);
                        stree += '</div>';
                        if (i == node.children.length - 1) {
                            idx -= 1;
                        }



                    }
                    stree += '</div>'
                }

            }

            function traverseNode(node) {
                stree += '<div class="tree-content" style="padding-left:' + idx * 20 + 'px">';
                if (node.children && node.children.length > 0) {
                    if (self.config.isexpand === true) {
                        stree += '<span class="expanded expand-icon fa fa-caret-right"></span>';
                    } else {
                        stree += '<span class="expand-icon fa fa-caret-right"></span>';
                    }

                } else {

                    stree += '<span class="is-leaf expand-icon fa fa-caret-right"></span>';
                }
                switch (node.type) {
                    case 'text':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-file-text-o"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'img-single':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-picture-o"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'img-text':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-newspaper-o"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'catalog':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-list"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'movie':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-film"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'sound':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-volume-up"></i><font>' + node.name + '</font></span>';
                        break;
                    case 'file':
                        stree += '<span class="tree-name"><i class="file-icon fa fa-folder-o"></i><font>' + node.name + '</font></span>';
                        break;
                }

                stree += '<span class="action-buttons"><a data-id="' + node.id + '" data-type="' + node.type + '" title="編輯素材" data-action="edit" class="blue"><i class="ace-icon fa fa-pencil"></i></a>';

                switch (node.type) {
                    case 'text':
                        stree += '<a data-id="' + node.id + '" data-type="' + node.type + '" title="增加流程" data-action="flow" class="orange" href="javascript:;"><i class="ace-icon fa fa-code-fork"></i></a>\
                    <a data-id="' + node.id + '" data-type="' + node.type + '" title="增加動作" data-action="act" class="green" href="javascript:;"><i class="ace-icon fa fa-thumb-tack"></i></a>';
                        break;
                    case 'img-text':
                        stree += '<a data-id="' + node.id + '" data-type="' + node.type + '" title="增加流程" data-action="flow" class="orange" href="javascript:;"><i class="ace-icon fa fa-code-fork"></i></a>\
                        <a data-id="' + node.id + '" data-type="' + node.type + '" title="增加動作" data-action="act" class="green" href="javascript:;"><i class="ace-icon fa fa-thumb-tack"></i></a>';
                        break;
                    case 'catalog':
                        stree += '<a data-id="' + node.id + '" data-type="' + node.type + '" title="增加流程" data-action="flow" class="disabled orange" href="javascript:;"><i class="ace-icon fa fa-code-fork"></i></a>\
                        <a data-id="' + node.id + '" data-type="' + node.type + '" title="增加動作" data-action="act" class="disabled green" href="javascript:;"><i class="ace-icon fa fa-thumb-tack"></i></a>';
                        break;
                    default:
                        stree += '<a data-id="' + node.id + '" data-type="' + node.type + '" title="增加流程" data-action="flow" class="orange" href="javascript:;"><i class="ace-icon fa fa-code-fork"></i></a>\
                       <a data-id="' + node.id + '" data-type="' + node.type + '" title="增加動作" data-action="act" class="disabled green" href="javascript:;"><i class="ace-icon fa fa-thumb-tack"></i></a>';
                }

                stree += '<a data-id="' + node.id + '" data-type="' + node.type + '" title="刪除素材" data-action="del" class="red" href="javascript:;"><i class="ace-icon fa fa-trash-o"></i></a>\
                </span></div>'

            }
            stree += '</div>';
            $tree.append(stree);
            self.setbtnpos();
            self.bindClick();
            self.bindEvt();

        },
        setbtnpos: function() {
            var self = this;
            var $tree = this.$elem.find('.tree');
            var dt = $tree.width() - 100
            this.$elem.find('.action-buttons').css('left', dt);
            $tree.scroll(function() {
                var dl = $(this).scrollLeft();
                self.$elem.find('.action-buttons').css('left', dt + dl);
                self.$elem.find('.tree-item').css('width', dt + dl);
            })
        },
        bindClick: function() {
            var self = this;
            this.$elem.on('click', '.tree-content', function() {
                $(this).next('.tree-children').slideToggle();
                $(this).find('.expand-icon').toggleClass('expanded');
            })
        },
        bindEvt: function() {
            var self = this;
            this.$elem.on('click', 'a[data-action=edit]', function(event) {
                event.stopPropagation();
                if ($(this).hasClass('disabled')) return false;
                var id = $(this).attr('data-id');
                var type = $(this).attr('data-type');
                if (typeof(self.config.onEdit) === 'function') {
                    self.config.onEdit(id, type);
                }





            })
            this.$elem.on('click', 'a[data-action=flow]', function(event) {
                event.stopPropagation();
                if ($(this).hasClass('disabled')) return false;
                var id = $(this).attr('data-id');
                var type = $(this).attr('data-type');
                if (typeof(self.config.onFlow) === 'function') {
                    self.config.onFlow(id, type);
                }
            })
            this.$elem.on('click', 'a[data-action=act]', function(event) {
                event.stopPropagation();
                if ($(this).hasClass('disabled')) return false;
                var id = $(this).attr('data-id');
                var type = $(this).attr('data-type');
                if (typeof(self.config.onAct) === 'function') {
                    self.config.onAct(id, type);
                }
            })
            this.$elem.on('click', 'a[data-action=del]', function(event) {
                event.stopPropagation();
                if ($(this).hasClass('disabled')) return false;
                var id = $(this).attr('data-id');
                var type = $(this).attr('data-type');
                if (typeof(self.config.onDel) === 'function') {
                    self.config.onDel(id, type);
                }
            })
        }
    }
    $.fn.mytree = function(options) {
        return this.each(function() {
            new mytree(this, options).init();
        });
    };

})(jQuery);
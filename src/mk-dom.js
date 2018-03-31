class mkDomInstance {
    constructor(el) {
        this.el = el;
        this.length = this.el.length;
    }

    css(styles) {
        for (let el of this.el) {
            for (let property in styles) {
                el.style[property] = styles[property];
            }
        }

        return this;
    }

    html(html) {
        for (let el of this.el) {
            el.innerHTML = html;
        }
        return this;
    }

    parent() {
        let newEl = [];
        for (let el of this.el) {
            newEl.push(el.parentNode);
        }
        return new mkDomInstance(newEl);
    }

    clear() {
        return html('');
    }

    append(newEl) {
        let clones = [];
        for (let el of this.el) {
            let clone = newEl.el.cloneNode(true);
            clones.push(clone);
            el.appendChild(clone);
        }
        return new mkDomInstance(clones);
    }

    prepend(newEl) {
        let clones = [];
        for (let el of this.el) {
            let clone = newEl.el.cloneNode(true);
            clones.push(clone);
            el.insertBefore(clone, el.childNodes[0]);
        }
        return new mkDomInstance(clones);
    }

    remove() {
        for (let el of this.el) {
            el.parentNode.removeChild(el);
        }
    }


    attr(key, val) {
        for (let el of this.el) {
            el.setAttribute(key, val);
        }
    }

    addClass(className) {
        for (let el of this.el) {
            if (el.classList) el.classList.add(className);
            else if (!hasClass(el, className)) el.className += ' ' + className;
        }
    }

    removeClass(className) {
        for (let el of this.el) {
            if (el.classList) el.classList.remove(className);
            else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    }


    on(type, handler) {
        for (let el of this.el) {
            el.addEventListener(type, handler);
        }
    }
    unbind(type, handler) {
        for (let el of this.el) {
            el.removeEventListener(type, handler);
        }
    }

    each(callback) {
        for (let el of this.el) {
            callback(el)
        }
        return this;
    }
}

class mkDomInstanceSingle {
    constructor(el) {
        this.el = el;
        this.length = 1;
    }

    css(styles) {
        for (let property in styles) {
            this.el.style[property] = styles[property];
        }
        return this;
    }

    height() {
        return this.el.offsetHeight;
    }
    width() {
        return this.el.offsetWidth;
    }

    html(html) {
        this.el.innerHTML = html;

        return this;
    }

    parent() {
        return new mkDomInstanceSingle(this.el.parentNode);
    }

    clear() {
        return this.html('');
    }

    append($newEl, cloning = false) {
        if (cloning) {
            let clone = $newEl.el.cloneNode(true);
            this.el.appendChild(clone);

            return new mkDomInstanceSingle(clone);
        } else {
            this.el.appendChild($newEl.el);
            return $newEl;
        }
    }

    prepend($newEl, cloning = false) {
        if (cloning) {
            let clone = $newEl.el.cloneNode(true);
            this.el.insertBefore(clone, el.childNodes[0]);

            return new mkDomInstanceSingle(clone);
        } else {
            this.el.insertBefore($newEl.el, el.childNodes[0]);
            return $newEl;
        }
    }

    insertBefore($newEl, cloning = false) {
        if (cloning) {
            let clone = $newEl.el.cloneNode(true);
            this.el.parentNode.insertBefore(clone, this.el);

            return new mkDomInstanceSingle(clone);
        } else {
            this.el.parentNode.insertBefore($newEl.el, this.el);
            return $newEl;
        }
    }
    insertAfter($newEl, cloning = false) {
        if (cloning) {
            let clone = $newEl.el.cloneNode(true);
            this.el.parentNode.insertBefore(clone, this.el.nextSibling);

            return new mkDomInstanceSingle(clone);
        } else {
            this.el.parentNode.insertBefore($newEl.el, this.el.nextSibling);
            return $newEl;
        }
    }

    remove() {
        if (this.el) {
            this.el.parentNode.removeChild(this.el);
        }
    }

    attr(key, val) {
        if (val) {
            this.el.setAttribute(key, val);
            return this;
        } else {
            return this.el.getAttribute(key);
        }
    }

    attrs(attributes) {
        for (let a in attributes) {
            this.attr(a, attributes[a]);
        }
        return this;
    }

    attrNS(ns, key, val) {
        this.el.setAttributeNS(ns, key, val);
        return this;
    }

    attrsNS(ns, attributes) {
        for (let a in attributes) {
            this.attrNS(ns, a, attributes[a]);
        }
        return this;
    }

    data(key, val) {
        if (key && val) {
            this.el.dataset[key] = val;
            return this;
        } else if (key) {
            return this.el.dataset[key];
        } else {
            return this.el.dataset;
        }

    }

    hasClass(className) {
        return this.el.classList ? this.el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(this.el.className);
    }

    addClass(className) {
        if (this.el.classList) this.el.classList.add(className);
        else if (!hasClass(this.el, className)) this.el.className += ' ' + className;
        return this;
    }

    removeClass(className) {
        if (this.el.classList) this.el.classList.remove(className);
        else this.el.className = this.el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        return this;
    }

    on(type, handler) {
        this.el.addEventListener(type, handler);
    }

    off(type, handler) {
        this.el.removeEventListener(type, handler);
    }

    unbind(type, handler) {
        this.el.removeEventListener(type, handler);
    }

    outline(color = "red", width = 1) {
        this.css({
            outline: width+"px solid "+color
        });
        return this;
    }

    outlineOff() {
        this.css({
            outline: "none"
        });
        return this;
    }
}

function $(selector, context) {
    return new mkDomInstance((context || document).querySelectorAll(selector), context);
}

function $1(selector, context) {
    return new mkDomInstanceSingle((context || document).querySelector(selector), context);
}

function $id(id) {
    return new mkDomInstanceSingle(document.getElementById(id));
}

function $new(tag) {
    return new mkDomInstanceSingle(document.createElement(tag));
}

function $newNS(ns, tag) {
    return new mkDomInstanceSingle(document.createElementNS(ns, tag));
}



export {$, $1, $id, $new, $newNS};
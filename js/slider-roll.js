'use strict';

function RollingSlider() {
    this.config = {
        selector: '',
        isSycling: false,
        direction: '',
        interval: 0,
        pause: 0,
    }
    this._CSS_CLASS = {
        ITEM: 'slider__item',
        ITEM_ACTIVE: 'slider__item_active',
        ITEM_LEFT: 'slider__item_left',
        ITEM_RIGHT: 'slider__item_right',
        ITEM_NEXT: 'slider__item_next',
        ITEM_PREV: 'slider__item_prev',
    }
    this._isSliding = false;
    this._interval = undefined;
    this._transitionDuration = 500;
    this._activePageIndex = 0;
}

RollingSlider.prototype = {
    init: function (config) {
        this.config.selector = config.selector;
        this.config.isSycling = config.isSycling;
        this.config.direction = config.direction;
        this.config.interval = config.interval;
        this.config.pause = config.pause;
        var SELF = this;
        var SLIDER = document.querySelector(SELF.config.selector);
        var ITEMS = SLIDER.querySelectorAll('.' + SELF._CSS_CLASS.ITEM);
        var CONTROL_LEFT = SLIDER.querySelector('.slider__control_left');
        var CONTROL_RIGHT = SLIDER.querySelector('.slider__control_right');
        SELF._activePageIndex = SELF._findActivePagePosition(ITEMS);
        var max = ITEMS.length;
        console.log('aaa');
        CONTROL_LEFT.addEventListener('click', function (e) {
            if (SELF._isSliding) {
                return;
            }
            SELF._stopSycle();
            var prevItemPos = (SELF._activePageIndex !== 0) ? SELF._activePageIndex - 1 : max - 1;
            SELF._prev(ITEMS, SELF._activePageIndex, prevItemPos);
        }, false);
        CONTROL_RIGHT.addEventListener('click', function (e) {
            if (SELF._isSliding) {
                return;
            }
            SELF._stopSycle();
            var nextPos = (SELF._activePageIndex !== max - 1) ? SELF._activePageIndex + 1 : 0;
            SELF._next(ITEMS, SELF._activePageIndex, nextPos);
        }, false);
        SELF._startCycle(ITEMS);
    },
    _next: function (items, activePageIndex, nextPos) {
        this._isSliding = true;
        items[nextPos].classList.add(this._CSS_CLASS.ITEM_NEXT);
        this._moveItemLeft(items, activePageIndex, nextPos);
    },
    _prev: function (items, activePageIndex, prevPos) {
        this._isSliding = true;
        items[prevPos].classList.add(this._CSS_CLASS.ITEM_PREV);
        this._moveItemRight(items, activePageIndex, prevPos);
    },
    _moveItemLeft: function (items, activePageIndex, nextPos) {
        var SELF = this;
        var leftClass = SELF._CSS_CLASS.ITEM_LEFT;
        var clearTransitionedClassesCallback = function (e) {
            SELF._removeTransitionedClasses(SELF, items[activePageIndex], items[nextPos]);
            // SELF._activePageIndex = nextPos;
            SELF._stopSycle();
            SELF._startCycle(items);
            setTimeout(function () {
                SELF._isSliding = false;
                items[activePageIndex].removeEventListener('transitionend', clearTransitionedClassesCallback, false);
                SELF._activePageIndex = nextPos;
            }, 100);
        };
        items[activePageIndex].addEventListener('transitionend', clearTransitionedClassesCallback, false);
        items[activePageIndex].classList.add(leftClass);
        setTimeout(function () {
            items[nextPos].classList.add(leftClass);
        }, 60);
    },
    _moveItemRight: function (items, activePageIndex, prevPos) {
        var SELF = this;
        var rightClass = SELF._CSS_CLASS.ITEM_RIGHT;
        var clearTransitionedClassesCallback = function (e) {
            SELF._removeTransitionedClasses(SELF, items[activePageIndex], items[prevPos]);
            // SELF._activePageIndex = prevPos;
            SELF._stopSycle();
            SELF._startCycle(items);
            setTimeout(function () {
                SELF._isSliding = false;
                items[activePageIndex].removeEventListener('transitionend', clearTransitionedClassesCallback, false);
                SELF._activePageIndex = prevPos;
            }, 100);
        }
        items[activePageIndex].addEventListener('transitionend', clearTransitionedClassesCallback, false);
        items[activePageIndex].classList.add(rightClass);
        setTimeout(function () {
            items[prevPos].classList.add(rightClass);
        }, 60);
    },
    _removeTransitionedClasses: function (self, activeItem, targetItem) {
        setTimeout(function () {
            //IF RIGHT SLIDING
            activeItem.classList.remove(this._CSS_CLASS.ITEM_LEFT);
            activeItem.classList.remove(this._CSS_CLASS.ITEM_ACTIVE);
            targetItem.classList.add(this._CSS_CLASS.ITEM_ACTIVE);
            targetItem.classList.remove(this._CSS_CLASS.ITEM_LEFT);
            targetItem.classList.remove(this._CSS_CLASS.ITEM_NEXT);
            //IF LEFT SLIDING
            activeItem.classList.remove(this._CSS_CLASS.ITEM_RIGHT);
            targetItem.classList.remove(this._CSS_CLASS.ITEM_RIGHT);
            targetItem.classList.remove(this._CSS_CLASS.ITEM_PREV);
        }.bind(self), 100);
    },
    _startCycle: function (items) {
        var max = items.length;
        this._interval = setInterval(function () {
            if (this._isSliding) {
                return;
            }
            var nextPos = (this._activePageIndex !== max - 1) ? this._activePageIndex + 1 : 0;
            this._next(items, this._activePageIndex, nextPos);
            this._activePageIndex = nextPos;
        }.bind(this), this.config.interval);
    },
    _stopSycle: function () {
        clearInterval(this._interval);
    },
    _findActivePagePosition: function (items) {
        var index = [].findIndex.call(items, element => element.classList.contains(this._CSS_CLASS.ITEM_ACTIVE));
        return index;
    }
}
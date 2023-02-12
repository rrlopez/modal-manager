"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _ModalManager_instanceArray;
Object.defineProperty(exports, "__esModule", { value: true });
exports.showModal = void 0;
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-constructor-return */
/* eslint-disable react/prop-types */
const react_1 = __importStar(require("react"));
let id = 0;
function* generateId() {
    while (true) {
        yield (id += 1);
    }
}
const idGenerator = generateId();
const defaultState = {
    modals: [],
};
class ModalManager extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
        const modalManager = __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray).find(({ name }) => name === props.name);
        if (modalManager)
            modalManager.instance = this;
        else
            __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray).unshift({ name: props.name, instance: this });
        ModalManager.instance = __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray)[0].instance;
        return ModalManager.instance;
    }
    componentWillUnmount() {
        this.unmount();
        this.clear();
    }
    showModal(Component, options = {}) {
        const { key } = options, props = __rest(options, ["key"]);
        const [...modals] = this.state.modals;
        const modal = modals.find((modal) => modal.key && modal.key === key);
        if (modal) {
            modal.open = true;
            modal.props = props;
        }
        else
            modals.push({ open: true, props, Component, key, id: key || idGenerator.next().value });
        this.setState({ modals });
    }
    delDueToBackButton(id) {
        this.setState(state => {
            const modal = state.modals.find((modal) => modal.id === id);
            if (modal)
                modal.open = false;
            return Object.assign({}, state);
        });
    }
    delModal(id) {
        this.delDueToBackButton(id);
    }
    unmount() {
        var _b;
        const instance = __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray).find(({ name }) => name === this.props.name);
        const index = __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray).indexOf(instance);
        if (index > -1)
            __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray).splice(index, 1);
        ModalManager.instance = (_b = __classPrivateFieldGet(ModalManager, _a, "f", _ModalManager_instanceArray)[0]) === null || _b === void 0 ? void 0 : _b.instance;
    }
    clear() {
        this.state.modals.forEach((_, i) => {
            this.delModal(i);
        });
    }
    render() {
        return this.state.modals.map(({ Component, open, props, id }) => (react_1.default.createElement(Component, Object.assign({ key: id }, props, {
            open,
            onClose: () => {
                this.delModal(id);
            },
        }))));
    }
}
_a = ModalManager;
_ModalManager_instanceArray = { value: [] };
const showModal = (...args) => ModalManager.instance.showModal(...args);
exports.showModal = showModal;
exports.default = ModalManager;

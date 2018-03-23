'use strict';

import axios from 'axios';
import debounce from 'lodash.debounce';
import create from 'dom-create-element';
import { AXIOS_CONFIG } from "./const";

class SearchGithubUser {
    constructor(inputNode, resultsNode) {
        if (typeof inputNode !== "object" || typeof resultsNode !== "object") {
            console.error('Parameters must be typeof node');
        } else {
            this.getUsers = this.getUsers.bind(this);
            this.onInputType = this.onInputType.bind(this);
            this.onInputTypeAdd = this.onInputTypeAdd.bind(this);
            this.onInputTypeDelete = this.onInputTypeDelete.bind(this);
            this.createSearchResults = this.createSearchResults.bind(this);
            this.removeSearchResults = this.removeSearchResults.bind(this);
            this.query = "";
            this.searchResults = {};
            this.inputNode = inputNode;
            this.resultsNode = resultsNode;
            this.queryArr = [];
            this.throttled = debounce(this.getUsers, 600);
            this.inputNode.addEventListener('input', this.onInputType, 1300, { passive: false });
        }
    }

    getUsers() {
        this.removeSearchResults();
        if (this.query !== "") {
            axios({
                AXIOS_CONFIG,
                url: `https://api.github.com/search/users?q=${this.query}`,
            }).then((response) => {
                if (response.status === 200) {
                    this.searchResults = response.data.items.slice(0, 4);
                    this.searchResults.forEach((value, i) => {
                        this.createSearchResults(value);
                    });
                } else {
                    console.log(`err ${response}`)
                }
            });
        }
    }

    onInputType(e) {
        (e.inputType === "deleteContentBackward" || e.inputType === "Delete") ? this.onInputTypeDelete(e) : this.onInputTypeAdd(e);
    }

    onInputTypeAdd(e) {
        this.queryArr.push(e.data);
        this.query = this.queryArr.join("");
        this.throttled();
    }

    onInputTypeDelete() {
        this.queryArr.pop();
        this.query = this.queryArr.join("");
        this.throttled();
        if (this.queryArr.length === 0) {
            this.removeSearchResults();
        }
    }

    removeSearchResults() {
        while (this.resultsNode.firstChild) {
            this.resultsNode.removeChild(this.resultsNode.firstChild);
        }
    }

    createSearchResults(item) {
        const backgroundImage = `styles="background-image: url(${item.avatar_url})"`;
        const el = create({
            selector: 'li',
            styles: 'Results__item',
            children: create({
                selector: 'a',
                link: item.html_url,
                target: '_blank',
                html: `<span>${item.login}<span ${backgroundImage}></span></span>`
            })
        })
        this.resultsNode.appendChild(el);
    }
}

export default SearchGithubUser;

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
            const header = document.createElement("span");
            header.innerHTML = opt.searchTitle;
            header.classList.add("Results__Head");
            const listContainer = document.createElement("div");
            listContainer.classList.add("Results__List");
            this.query = "";
            this.searchResults = {};
            this.inputNode = opt.input;
            this.resultsNode = opt.resultsContainer;
            this.resultsNode.appendChild(header);
            this.resultsNode.appendChild(listContainer);
            this.resultsNodeList = this.resultsNode.querySelector('.Results__List');
            this.resultsNodeHidden = 'Results--ishidden';
            this.queryArr = [];
            this.throttled = debounce(this.getUsers, 600);
            this.inputNode.addEventListener('input', this.onInputType, 1300, { passive: false });
            this.displayResults = {
                off: () => this.resultsNode.classList.add(this.resultsNodeHidden),
                on: () => this.resultsNode.classList.remove(this.resultsNodeHidden)
            }
            this.displayResults.off();
        }
    }

    onInputType(e) {
        (e.inputType === "deleteContentBackward" || e.inputType === "Delete") ? this.onInputTypeDelete(e) : this.onInputTypeAdd(e);
    }

    onInputTypeAdd(e) {
        this.displayResults.on();
        this.queryArr.push(e.data);
        this.query = this.queryArr.join("");
        this.throttled();
    }

    onInputTypeDelete() {
        this.queryArr.pop();
        this.query = this.queryArr.join("");
        this.throttled();
        if (this.queryArr.length === 0) this.removeSearchResults();
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
        this.resultsNodeList.appendChild(el);
    }

    removeSearchResults() {
        while(this.resultsNodeList.children.length) this.resultsNodeList.removeChild(this.resultsNodeList.firstChild);
        if (this.queryArr.length === 0) this.displayResults.off();
    }
}

export default SearchGithubUser;

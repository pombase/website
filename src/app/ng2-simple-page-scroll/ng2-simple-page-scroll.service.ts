// The MIT License (MIT)
//
// Copyright (c) 2017 Benny Bottema
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {Injectable, Inject} from '@angular/core';
import {SimplePageScrollConfig} from './ng2-simple-page-scroll-config';

export declare type TargetElement = HTMLElement | string;

@Injectable()
export class SimplePageScrollService {

    private document: any;
    private body: HTMLBodyElement;

    public constructor(@Inject('Document') document: any) {
        this.document = document;
        this.body = <HTMLBodyElement>document.body;
    }

    public scrollToElement(targetElementOrId: TargetElement, pageScrollOffset: number): void {
        let anchorTarget = this.determineElement(targetElementOrId);
        if (anchorTarget !== null) {

            setScrollTop(this.body);
            setScrollTop(this.document.documentElement);
            setScrollTop(this.document.body.parentNode);
        }

        function setScrollTop(container: any) {
            if (container && typeof container.scrollTop !== 'undefined') {
                container.scrollTop =
                    anchorTarget.offsetTop -
                    anchorTarget.scrollTop +
                    anchorTarget.clientTop +
                    (pageScrollOffset || SimplePageScrollConfig.defaultScrollOffset);
            }
        }
    }

    private determineElement(targetElementOrId: TargetElement): HTMLElement {
        if (typeof targetElementOrId === 'string') {
            return this.document.getElementById((<string>targetElementOrId).substr(1));
        } else {
            return <HTMLElement>targetElementOrId;
        }
    }
}

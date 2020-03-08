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

import {Directive, Input, Output, EventEmitter, AfterViewChecked} from '@angular/core';
import {Router, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {SimplePageScrollService} from './ng2-simple-page-scroll.service';

@Directive({
    selector: '[simplePageScroll]',
    host: { // tslint:disable-line:use-host-property-decorator
        '(click)': 'handleClick($event)',
    }
})
// tslint:disable-next-line:directive-class-suffix
export class SimplePageScroll implements AfterViewChecked {

    @Input()
    private routerLink: any;

    @Input()
    private href: string;

    @Input()
    private pageScrollOffset: number = null;

    @Output()
    public pageScrollFinish: EventEmitter<boolean> = new EventEmitter<boolean>();

    private shouldScroll = false;

    constructor(private router: Router, private simplePageScrollService: SimplePageScrollService) {
    }

    public handleClick(clickEvent: Event): boolean { // tslint:disable-line:no-unused-variable
        if (this.routerLink && this.router !== null && this.router !== undefined) {
            // wait for router to finish navigating
            // Note: the change event is also emitted when navigating to the current route again
            let subscription: Subscription = <Subscription>this.router.events.subscribe((routerEvent) => {
                if (routerEvent instanceof NavigationEnd) {
                    subscription.unsubscribe();
                    this.shouldScroll = true;
                } else if (routerEvent instanceof NavigationError || routerEvent instanceof NavigationCancel) {
                    subscription.unsubscribe();
                    this.pageScrollFinish.emit(false);
                }
            });
        } else {
            // no router action; scroll immediately
            this.scrollAndEmitEvent();
        }
        return false; // to preventDefault()
    }

    private scrollAndEmitEvent() {
        this.simplePageScrollService.scrollToElement(this.href, this.pageScrollOffset);
        this.shouldScroll = false;
        this.pageScrollFinish.emit(true);
    }

    ngAfterViewChecked(): void {
        if (this.shouldScroll) {
            this.scrollAndEmitEvent();
        }
    }
}

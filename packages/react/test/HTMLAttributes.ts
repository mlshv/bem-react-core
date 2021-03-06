import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getMountedNode } from './helpers/node';

describe('Bem', () => {
    it('renders <div> by default', () => {
        expect(getMountedNode(createElement(Bem, {
            block: 'Block'
        })).type()).toBe('div');
    });

    it('passes tag by props', () => {
        expect(getMountedNode(createElement(Bem, {
            block: 'Block', tag: 'b'
        })).type()).toBe('b');
    });

    it('allows inline attrs', () => {
        expect(getMountedNode(createElement(Bem, {
            block: 'Block', tag: 'b', id: 'the-id'
        })).prop('id')).toBe('the-id');
    });

    it('supports aria attributes', () => {
        expect(getMountedNode(createElement(Bem, {
            block: 'Block', tag: 'b', 'aria-labelledby': 'address'
        })).prop('aria-labelledby')).toBe('address');
    });
});

describe('Component', () => {
    it('renders <div> by default', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
        }

        expect(getMountedNode(createElement(MyBlock)).type()).toBe('div');
    });

    it('uses declared tag', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public tag() {
                return 'a';
            }
        }

        expect(getMountedNode(createElement(MyBlock)).type()).toBe('a');
    });

    it('uses declared attrs', () => {
        interface IBProps {
            ariaLabelledBy: string;
            id: string;
        }

        interface IBState {
            name: string;
        }
        class MyBlock extends Block<IBProps, IBState> {
            public block = 'MyBlock';

            constructor(props: any) {
                super(props);
                this.state = { name: 'the-name' };
            }

            public attrs() {
                return {
                    'aria-labelledby': this.props.ariaLabelledBy,
                    id: this.props.id,
                    name: this.state.name
                };
            }
        }

        expect(getMountedNode(createElement(MyBlock, {
            ariaLabelledBy: 'address',
            id: 'the-id'
        })).props()).toMatchObject({
            'aria-labelledby' : 'address',
            id: 'the-id',
            name: 'the-name'
        });
    });

    it('has declared style', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';

            public attrs() {
                return { style : { font : 'bold', color : 'green' } };
            }

            public style() {
                return { color : 'red', background : 'blue' };
            }
        }

        expect(getMountedNode(createElement(MyBlock)).props())
            .toMatchObject({
                style: { font : 'bold', color : 'red', background : 'blue' }
            });
    });
});

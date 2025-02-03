import React, { ReactNode, Ref, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref as Ref<HTMLSpanElement>}
      className={`cursor-pointer ${
        reversed
          ? active
            ? 'text-white'
            : 'text-[#aaa]'
          : active
            ? 'text-black'
            : 'text-[#ccc]'
      } ${className}`}
    />
  )
);

Button.displayName = 'Button';

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: unknown;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => {
    const textLines = (value as any).document.nodes
      .map((node: any) => node.text)
      .toArray()
      .join('\n');
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        {...props}
        className={`mt-[30px] -mx-[20px] ${className}`}
      >
        <div className="text-sm px-5 py-[5px] text-[#404040] border-t-2 border-[#eeeeee] bg-[#f8f8f8]">
          Slate&apos;s value as text
        </div>
        <div className="text-[#404040] font-mono text-xs whitespace-pre-wrap px-5 py-[10px] [&>div]:mb-2">
          {textLines}
        </div>
      </div>
    );
  }
);

EditorValue.displayName = 'EditorValue';

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref as Ref<HTMLSpanElement>}
      className={`material-icons text-lg align-text-bottom ${className}`}
    />
  )
);

Icon.displayName = 'Icon';

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref as Ref<HTMLDivElement>}
      className={`whitespace-pre-wrap -mx-[20px] mb-[10px] px-5 py-[10px] text-sm bg-[#f8f8e8] ${className}`}
    />
  )
);

Instruction.displayName = 'Instruction';

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref as Ref<HTMLDivElement>}
      className={`[&>*]:inline-block [&>*+*]:ml-[15px] ${className}`}
    />
  )
);

Menu.displayName = 'Menu';

export const Portal = ({ children }: { children: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref as Ref<HTMLDivElement>}
      className={`relative px-[18px] py-[1px] pb-[17px] -mx-5 border-b-2 border-[#eee] mb-5 ${className}`}
    />
  )
);

Toolbar.displayName = 'Toolbar';

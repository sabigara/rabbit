import { createSignal, Show, type JSX, Component } from 'solid-js';
import MagnifyingGlass from 'heroicons/24/solid/magnifying-glass.svg';
import PencilSquare from 'heroicons/24/solid/pencil-square.svg';
import Cog6Tooth from 'heroicons/24/outline/cog-6-tooth.svg';

import NotePostForm from '@/components/NotePostForm';
import Config from '@/components/Config';

import { useHandleCommand } from '@/hooks/useCommandBus';
import useConfig from '@/nostr/useConfig';

const SideBar: Component = () => {
  let textAreaRef: HTMLTextAreaElement | undefined;

  const { config } = useConfig();
  const [formOpened, setFormOpened] = createSignal(false);
  const [configOpened, setConfigOpened] = createSignal(false);

  const focusTextArea = () => {
    textAreaRef?.focus();
    textAreaRef?.click();
  };
  const openForm = () => setFormOpened(true);
  const closeForm = () => setFormOpened(false);
  const toggleForm = () => setFormOpened((current) => !current);

  useHandleCommand(() => ({
    commandType: 'openPostForm',
    handler: () => {
      openForm();
      if (textAreaRef != null) {
        setTimeout(() => focusTextArea(), 100);
      }
    },
  }));

  return (
    <div class="flex shrink-0 flex-row border-r bg-sidebar-bg">
      <div class="flex w-14 flex-auto flex-col items-center gap-3 border-r border-rose-200 pt-5">
        <div class="flex flex-col items-center gap-3">
          <button
            class="h-9 w-9 rounded-full border border-primary bg-primary p-2 text-2xl font-bold text-white"
            onClick={() => toggleForm()}
          >
            <PencilSquare />
          </button>
          {/*
          <button class="h-9 w-9 rounded-full border border-primary p-2 text-2xl font-bold text-primary">
            <MagnifyingGlass />
          </button>
          */}
          {/* <div>column 1</div> */}
          {/* <div>column 2</div> */}
        </div>
        <div class="grow" />
        <div>
          <button
            class="h-12 w-12 p-3 text-primary"
            onClick={() => setConfigOpened((current) => !current)}
          >
            <Cog6Tooth />
          </button>
        </div>
      </div>
      <div
        classList={{
          static: formOpened() || config().keepOpenPostForm,
          hidden: !(formOpened() || config().keepOpenPostForm),
        }}
      >
        <NotePostForm
          textAreaRef={(el) => {
            textAreaRef = el;
          }}
          onClose={closeForm}
        />
      </div>
      <Show when={configOpened()}>
        <Config onClose={() => setConfigOpened(false)} />
      </Show>
    </div>
  );
};

export default SideBar;

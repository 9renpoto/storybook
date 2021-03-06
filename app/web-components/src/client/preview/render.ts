import { document, Node } from 'global';
import dedent from 'ts-dedent';
import { render, TemplateResult } from 'lit-html';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/client-api';
import { RenderContext } from './types';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  forceRender,
}: RenderContext) {
  const element = storyFn();

  showMain();
  if (element instanceof TemplateResult) {
    // `render` stores the TemplateInstance in the Node and tries to update based on that.
    // Since we reuse `rootElement` for all stories, remove the stored instance first.
    // But forceRender means that it's the same story, so we want too keep the state in that case.
    if (!forceRender || !rootElement.querySelector('[id="root-inner"]')) {
      rootElement.innerHTML = '<div id="root-inner"></div>';
    }
    const renderTo = rootElement.querySelector('[id="root-inner"]');

    render(element, renderTo);
    simulatePageLoad(rootElement);
  } else if (typeof element === 'string') {
    rootElement.innerHTML = element;
    simulatePageLoad(rootElement);
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (rootElement.firstChild === element && forceRender === true) {
      return;
    }

    rootElement.innerHTML = '';
    rootElement.appendChild(element);
    simulateDOMContentLoaded();
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}

import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { ChipsModule } from './chips.module';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipComponent } from './chip.component';

storiesOf('Custom/Feature Module as Context with forRoot', module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule.forRoot()],
    })
  )
  .add(
    'Component with self and dependencies declared in its feature module',
    () => {
      const props: { [K in keyof ChipsGroupComponent]?: any } = {
        chips: object('Chips', [
          {
            id: 1,
            text: 'Chip 1',
          },
          {
            id: 2,
            text: 'Chip 2',
          },
        ]),
        removeChipClick: action('Remove chip'),
        removeAllChipsClick: action('Remove all chips clicked'),
      };
      return {
        props,
      };
    },
    {
      component: ChipsGroupComponent,
    }
  )
  .add(
    'Component with default providers',
    () => {
      const props: { [K in keyof ChipComponent]?: any } = {
        displayText: text('Display Text', 'My Chip'),
        removeClicked: action('Remove icon clicked'),
      };
      return {
        props,
      };
    },
    {
      component: ChipComponent,
    }
  )
  .add(
    'Component with overridden provider',
    () => {
      const props: { [K in keyof ChipComponent]?: any } = {
        displayText: text('Display Text', 'My Chip'),
        removeClicked: action('Remove icon clicked'),
      };
      return {
        props,
      };
    },
    {
      component: ChipComponent,
    }
  );

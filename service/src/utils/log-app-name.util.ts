import figlet from 'figlet';
import chalk from 'chalk';

export function logSmartStockAI(): void {
  figlet('Smart Stock AI', { font: 'Standard' }, (err, data) => {
    if (err) {
      console.log('Error generating ASCII art...');
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
    console.log(chalk.gray('--- AI-Powered Stock Analysis Engine ---'));
  });
}
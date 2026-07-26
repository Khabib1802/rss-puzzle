import BaseComponent from '@/components/BaseComponent';
import ResultItem from '@/components/statistics/ResultItem/ResultItem';
import type { RoundSentenceResult } from '@/types/game';

import styles from './ResultsList.module.scss';

class ResultsList extends BaseComponent<HTMLUListElement> {
  constructor(results: RoundSentenceResult[]) {
    super('ul', [styles.list]);

    results.forEach((result) => {
      this.append(new ResultItem(result));
    });
  }
}

export default ResultsList;

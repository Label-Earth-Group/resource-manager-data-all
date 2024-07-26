import CqlComparisonOperator from './comparison';

export class CqlLike extends CqlComparisonOperator {
  static SYMBOL = 'like';

  constructor(pred = null, obj = null) {
    super(CqlLike.SYMBOL, pred, obj);
  }

  static get label() {
    return '~';
  }
}

import {getMessage} from 'modules/locale/helpers';
import {TMessage} from 'modules/locale/types';
import {useMemo} from 'react';
import {useIntl} from 'react-intl';

/**
 * Получить Сообщение.
 * @return {*} Сообщение.
 */
export const useMessage = (): TMessage => {
  const intl = useIntl();

  return useMemo(() => getMessage(intl), [intl]);
};

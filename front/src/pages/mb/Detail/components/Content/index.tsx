import React from 'react';
import styles from './styles.less';
import { connect } from 'umi';

interface Props {
  dispatch: (params: any) => void;
  detail: any;
  header: any;
  login: any;
}

const Content = (props: Props) => {
  const { detail } = props;
  const { data } = detail;
  const { content = '' } = data;

  // 渲染文本内容
  const renderContent = (content: string, rule: RegExp) => {
    if (!content || typeof content !== 'string') {
      return null;
    }
    let copyStr = content + ' ';
    const arr: JSX.Element[] = [];
    const matchs = copyStr.match(rule);
    if (!matchs) {
      return [copyStr];
    }
    matchs.forEach((item, index) => {
      const splitArr = copyStr.split(item);
      arr.push(
        <span key={`span${index}`}>{splitArr[0]}</span>,
        <a key={`a${index}`} target="_blank" href={item}>
          {item}
        </a>,
      );
      copyStr = splitArr[1];
    });
    arr.push(<span key={`spanLast`}>{copyStr}</span>);
    return arr;
  };

  return (
    <div className={styles.leftContent}>
      {/* {renderContent(content, /@.*?\s/gi)} */}
      {renderContent(
        content,
        /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/gi,
      )}
    </div>
  );
};

// @ts-ignore
export default connect(({ detail, header, login }) => ({
  detail,
  header,
  login,
}))(Content);

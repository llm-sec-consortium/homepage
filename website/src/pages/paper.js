import React, { useState } from 'react';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, List, Tag, Divider } from 'antd';
import Layout from '@theme/Layout';

import paperList from '@site/static/data/papers.json';

// get the unique venues
const uniqueVenues = [...new Set(paperList.map(
  record => record.venue))];
// map them into colors
const COLORS = ['red', 'volcano', 'orange', 'gold', 'yellow', 'lime',
  'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta']
const hashString = (string) => string.split('').map((char) => char.charCodeAt(0)).reduce((a, b) => a + b, 0)
const venueToColor = (string) => COLORS[hashString(string) % COLORS.length];

const venueFilters = uniqueVenues.map((venue) => ({text: venue, value: venue}));

const uniqueYears = [...new Set(paperList.map(record => record.year))];
const yearFilters = uniqueYears.map((year) => ({text: year, value: year}));

const uniqueAuthors = [...new Set(paperList.map(paper =>
  paper.authors.map(author => author.author_name)).flat(1))]
console.log(paperList.map(paper =>
  paper.authors.map(author => author.author_name)).flat(1))
// TODO maybe make the text highlight our authors
const authorFilters = uniqueAuthors.map((author_name) => (
  {text: author_name, value: author_name}))
// const authorFilters = uniqueAuthors.map((author) => (
  // {text: author.author_highlight? <b>{author.author_name}</b> : author.author_name, value: author.author_name}))

const columns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
    filters: yearFilters,
    onFilter: (value, record) => record.year === value,
    sorter: (a, b) => a.year - b.year,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Venue',
    dataIndex: 'venue',
    key: 'venue',
    filters: venueFilters,
    onFilter: (value, record) => record.venue === value,
    render: (venue) => (
      <Tag color={venueToColor(venue)} key={venue}>
        {venue}
      </Tag>
    )
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Authors',
    dataIndex: 'authors',
    key: 'authors',
    render: (authors) => (
      <Space size={[0, 8]} wrap>
        {authors.map((author) => {
          return author.author_highlight ? <a href={author.author_url}>
              <Tag bordered={false} color="geekblue">{author.author_name}</Tag></a>
            : <a href={author.author_url}><Tag bordered={false}>{author.author_name}</Tag></a>;
        })}
      </Space>
    ),
    filters: authorFilters,
    filterSearch: true,
    onFilter: (value, record) => record.authors.map(author => author.author_name).includes(value)
  },
  {
    title: 'By Us',
    dataIndex: 'written_by_us',
    key: 'written_by_us',
    render: (written_by_us) => {
      return written_by_us ? <CheckCircleTwoTone twoToneColor='green'/>
        : <CloseCircleTwoTone twoToneColor='red'/>;
    },
    filters: [
      {
        text: "Written By Us",
        value: true
      },
      {
        text: "Written By Others",
        value: false
      }
    ],
    onFilter: (value, record) => record.written_by_us === value
  },
  {
    title: 'Citations',
    dataIndex: 'citation_count',
    key: 'citation_count',
    sorter: (a, b) => a.citation_count - b.citation_count,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Action',
    key: 'action',
    render: (record) => (
      <Space size="middle">
        <a href={record.ss_url}>View on SemanticScholar</a>
      </Space>
    ),
  },
];

const defaultExpandable = {
  expandedRowRender: (record) => {
    return (
      <>
        <p><b>Summary</b></p>
        <Divider />
        <p>{record.tldr}</p>
      </>
    );
  },
  rowExpandable: (record) => record.tldr.length > 0
};
const defaultTitle = () => 'List of Papers';
const Paper = () => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('middle');
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [tableLayout, setTableLayout] = useState();
  const [ellipsis, setEllipsis] = useState(false);


  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));

  const tableProps = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    // scroll: {y: 500},
    tableLayout,
    pagination: {
      showSizeChanger: true
    }
  };
  return (
    <Layout
      title={`Papers related to LLM & Security`}
      description="">
      <main>
        <div  style={{ background: "#EFF2F5", padding: "16px" }}>
          <Table
            {...tableProps}
            columns={tableColumns}
            dataSource={paperList}
          />
        </div>
      </main>
    </Layout>
  );
};
export default Paper;
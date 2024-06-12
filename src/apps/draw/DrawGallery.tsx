import * as React from 'react';
import { Box, Table } from '@mui/joy';

import { dBlobCacheT256, DBlobImageItem, DBlobMetaDataType } from '~/modules/dblobs/dblobs.types';
import { useDBlobItemsByTypeCIdSId } from '~/modules/dblobs/dblobs.hooks';

import { AppPlaceholder } from '../AppPlaceholder';


export function DrawGallery({ domain }: { domain: 'draw' | 'app' }) {
  const [items] = useDBlobItemsByTypeCIdSId<DBlobImageItem>(
    DBlobMetaDataType.IMAGE,
    'global',
    domain === 'draw' ? 'app-draw' : 'app-chat',
  );

  if (!items || items.length === 0) {
    return <AppPlaceholder text={items === undefined ? 'Loading...' : 'No images found.'} />;
  }

  const boxStyles = {
    flexGrow: 1,
    overflowY: 'auto',
    p: { xs: 2, md: 6 },
  };

  const cellStyles = {
    overflowWrap: 'anywhere',
    whiteSpace: 'break-spaces',
  };

  return (
    <Box sx={boxStyles}>
      <Table borderAxis='both' size='sm' stripe='odd' variant='plain'>
        <thead>
        <tr>
          <th>Image</th>
          <th>Origin</th>
          <th>Metadata</th>
        </tr>
        </thead>
        <tbody>
        {items.map(({ id, label, cache, data, origin, metadata, createdAt, updatedAt }) => (
          <tr key={id}>
            <td>
              <Box sx={cellStyles}>
                <picture style={{ display: 'flex', maxWidth: 256, maxHeight: 256 }}>
                  <img
                    src={cache[dBlobCacheT256]?.base64 ? `data:${cache[dBlobCacheT256]?.mimeType};base64,${cache[dBlobCacheT256]?.base64}` : `data:${data.mimeType};base64,${data.base64}`}
                    alt={label}
                    style={{
                      boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.1)',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      opacity: cache[dBlobCacheT256]?.base64 ? 1 : 0.5,
                    }}
                  />
                </picture>
                {label}
              </Box>
            </td>
            <td>
              <Box sx={cellStyles}>{JSON.stringify(origin, null, 2)}</Box>
            </td>
            <td>
              <Box sx={cellStyles}>
                {JSON.stringify(metadata, null, 2)}
                <br />
                {createdAt ? new Date(createdAt).toLocaleString() : 'no creation'}
                <br />
                {updatedAt && updatedAt !== createdAt ? new Date(updatedAt).toLocaleString() : null}
              </Box>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </Box>
  );
}
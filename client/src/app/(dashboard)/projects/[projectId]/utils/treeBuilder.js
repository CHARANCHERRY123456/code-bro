
export function buildTree(flat) {
  if (!flat || flat.length === 0) return [];
  
  const map = {};
  const roots = [];
  
  flat.forEach(n => (map[n.id] = { 
    ...n, 
    children: n.type === "FOLDER" ? [] : undefined 
  }));
  
  flat.forEach(n => {
    if (n.parentId) {
      if (map[n.parentId] && map[n.parentId].children) {
        map[n.parentId].children.push(map[n.id]);
      } else {
        roots.push(map[n.id]);
      }
    } else {
      roots.push(map[n.id]);
    }
  });
  
  return roots;
}


export function insertNode(treeArray, parentId, newNode) {
  if (parentId === null) {
    treeArray.push(newNode);
    return true;
  }

  for (const node of treeArray) {
    if (node.id === parentId) {
      if (!node.children) node.children = [];
      node.children.unshift(newNode);
      return true;
    }
    if (node.children && node.children.length) {
      const inserted = insertNode(node.children, parentId, newNode);
      if (inserted) return true;
    }
  }
  return false;
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
